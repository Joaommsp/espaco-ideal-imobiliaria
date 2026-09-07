"use client";

import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import type { Praca } from "@/data/atuacao";
import { agruparPorProximidade } from "@/lib/utils/agrupamento";
import { CAIXA_DO_MAPA } from "@/lib/utils/estilos";
import { contarImoveis } from "@/lib/utils/imovel";

/**
 * Mapa das praças. Só é montado quando a seção entra na tela — quem cuida
 * disso é o `MapaDePracas`, para o Leaflet não pesar na abertura da landing.
 *
 * Este é o adaptador entre o React e uma biblioteca imperativa. A regra que
 * mantém isso são: o React manda por props, e tudo que o desenho lê vem de
 * ref. Os pinos são reconstruídos a cada zoom, fora do ciclo do React, e uma
 * closure velha aqui repinta o mapa com dado de dois estados atrás.
 */

/** Distância mínima, em pixels, para dois pinos viverem separados. */
const RAIO_DE_AGRUPAMENTO = 34;

/** Folga em torno das praças ao enquadrar, para nenhum pino colar na borda. */
const FOLGA_DO_ENQUADRAMENTO: L.PointTuple = [46, 46];

const ZOOM_MAXIMO = 16;

/** Zoom de rua: é o que "ver a cidade" quer dizer num mapa de imóveis. */
const ZOOM_DA_CIDADE = 12;

/** Quantos degraus o clique num grupo aproxima para separá-lo. */
const DEGRAUS_AO_SEPARAR = 2;

/** Tamanho do pino: cresce com a carteira, com teto para não virar mancha. */
const PINO_BASE = 24;
const PASSO_POR_IMOVEL = 3;
const IMOVEIS_ATE_O_TETO = 6;

/**
 * Espaço que um rótulo ocupa ao lado do pino. Serve para decidir de que lado
 * escrevê-lo: posto sempre à direita, o nome de uma praça acaba por cima do
 * pino da praça vizinha.
 */
const LARGURA_DO_ROTULO = 118;
const FAIXA_DO_ROTULO = 18;
const FOLGA_DO_ROTULO = 3;

/**
 * OpenStreetMap: é o único basemap que continua servindo sem chave — o
 * Positron do CARTO passou a carimbar "API KEY REQUIRED" sobre os tiles.
 *
 * O OSM é colorido demais para esta paleta, então ele é dessaturado no CSS
 * (`.mapa-pracas .leaflet-tile-pane`), o que devolve o cinza claro que se
 * queria e deixa o laranja dos pinos como única cor forte do mapa.
 */
const TILES = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const CREDITO =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

function tamanhoDoPino(imoveis: number): number {
  return PINO_BASE + Math.min(imoveis, IMOVEIS_ATE_O_TETO) * PASSO_POR_IMOVEL;
}

/** Há vizinho no caminho do rótulo deste lado? */
function ladoLivre(
  centro: { x: number; y: number },
  vizinhos: { x: number; y: number }[],
  paraDireita: boolean,
): boolean {
  return !vizinhos.some((outro) => {
    if (Math.abs(outro.y - centro.y) > FAIXA_DO_ROTULO) return false;

    const distancia = paraDireita ? outro.x - centro.x : centro.x - outro.x;
    return distancia > 0 && distancia < LARGURA_DO_ROTULO;
  });
}

/**
 * Praça escolhida. O `pedido` cresce a cada escolha para que clicar duas vezes
 * na mesma praça continue sendo duas ordens de voar até ela — com um valor
 * simples, o segundo clique não mudaria o estado e nada aconteceria.
 */
export interface VisaoDoMapa {
  alvo: string | null;
  pedido: number;
}

interface TelaDoMapaProps {
  pracas: Praca[];
  /** Praça sob o cursor, aqui ou na lista ao lado. */
  destacada: string | null;
  aoDestacar: (nome: string | null) => void;
  visao: VisaoDoMapa;
  aoEscolher: (nome: string) => void;
  enderecoDaCidade: (praca: Praca) => string;
}

export function TelaDoMapa({
  pracas,
  destacada,
  aoDestacar,
  visao,
  aoEscolher,
  enderecoDaCidade,
}: TelaDoMapaProps) {
  const caixa = useRef<HTMLDivElement>(null);
  const mapa = useRef<L.Map | null>(null);
  const camada = useRef<L.LayerGroup | null>(null);
  const router = useRouter();

  /** Praça cujo balão está aberto, para sobreviver ao redesenho dos pinos. */
  const aberta = useRef<string | null>(null);
  /** Marcador de cada praça, para acender o destaque sem reconstruir nada. */
  const marcadores = useRef(new Map<string, L.Marker>());

  // Tudo que o desenho lê passa por aqui. Ver o comentário do topo.
  const pracasRef = useRef(pracas);
  const destacadaRef = useRef(destacada);
  const aoDestacarRef = useRef(aoDestacar);
  const aoEscolherRef = useRef(aoEscolher);
  const enderecoRef = useRef(enderecoDaCidade);
  const routerRef = useRef(router);
  pracasRef.current = pracas;
  destacadaRef.current = destacada;
  aoDestacarRef.current = aoDestacar;
  aoEscolherRef.current = aoEscolher;
  enderecoRef.current = enderecoDaCidade;
  routerRef.current = router;

  /** O desenho vive num ref para o listener do Leaflet chamar sempre o atual. */
  const desenhar = useRef<() => void>(() => {});

  desenhar.current = function desenharPinos() {
    const instancia = mapa.current;
    const grupo = camada.current;
    if (!instancia || !grupo) return;

    // `clearLayers` remove os marcadores e o Leaflet fecha o balão junto,
    // disparando `popupclose` na hora — que zeraria `aberta`. Guardar antes é
    // o que permite reabrir o balão certo no fim do desenho.
    const reabrir = aberta.current;

    grupo.clearLayers();
    marcadores.current.clear();

    const agrupadas = agruparPorProximidade(
      pracasRef.current,
      (praca) => instancia.latLngToContainerPoint(praca.coordenada),
      RAIO_DE_AGRUPAMENTO,
    );

    for (const conjunto of agrupadas) {
      const juntas = conjunto.itens.length > 1;
      const total = conjunto.itens.reduce((soma, praca) => soma + praca.imoveis, 0);
      const lado = tamanhoDoPino(total);
      const centro = instancia.containerPointToLatLng([conjunto.x, conjunto.y]);
      const praca = conjunto.itens[0];
      const emFoco = !juntas && destacadaRef.current === praca.nome;

      const marcador = L.marker(centro, {
        keyboard: true,
        title: juntas
          ? `${conjunto.itens.map((item) => item.nome).join(" e ")} — aproxime para separar`
          : `${praca.nome}, ${contarImoveis(total)}`,
        icon: L.divIcon({
          className: "",
          html: `<span class="pino-praca${juntas ? " agrupado" : ""}${emFoco ? " em-foco" : ""}" style="width:${lado}px;height:${lado}px">${total}</span>`,
          iconSize: [lado, lado],
          iconAnchor: [lado / 2, lado / 2],
        }),
      });

      if (juntas) {
        // Aproximar é o que resolve o amontoado — o clique faz isso direto.
        marcador.on("click", () => {
          instancia.setView(
            centro,
            Math.min(instancia.getZoom() + DEGRAUS_AO_SEPARAR, ZOOM_MAXIMO),
          );
        });
      } else {
        marcador.on("click", () => aoEscolherRef.current(praca.nome));
        marcador.on("mouseover", () => aoDestacarRef.current(praca.nome));
        marcador.on("mouseout", () => aoDestacarRef.current(null));

        const outros = agrupadas.filter((item) => item !== conjunto);
        const cabeADireita = ladoLivre(conjunto, outros, true);
        const cabeAEsquerda = ladoLivre(conjunto, outros, false);

        // Sem lado livre, o nome fica só no hover: melhor faltar um rótulo do
        // que empilhar dois em cima do mesmo pino.
        if (cabeADireita || cabeAEsquerda) {
          marcador.bindTooltip(praca.nome, {
            permanent: true,
            direction: cabeADireita ? "right" : "left",
            offset: [(cabeADireita ? 1 : -1) * (lado / 2 + FOLGA_DO_ROTULO), 0],
            className: "rotulo-praca",
          });
        }

        marcador.bindPopup(balaoDaPraca(praca, enderecoRef.current(praca)), {
          closeButton: true,
          offset: [0, -lado / 2],
          // Com autoPan o balão move o mapa, o `moveend` redesenha os pinos e
          // o balão recém-aberto morre no meio do caminho.
          autoPan: false,
        });
        marcador.on("popupopen", () => {
          aberta.current = praca.nome;
        });
        marcador.on("popupclose", () => {
          if (aberta.current === praca.nome) aberta.current = null;
        });

        marcadores.current.set(praca.nome, marcador);
      }

      marcador.addTo(grupo);
    }

    if (reabrir) {
      aberta.current = reabrir;
      marcadores.current.get(reabrir)?.openPopup();
    }
  };

  useEffect(() => {
    if (!caixa.current || mapa.current) return;

    const instancia = L.map(caixa.current, {
      zoomControl: true,
      attributionControl: true,
      // Rolar a página não pode virar zoom sem querer: o mapa fica no meio da
      // landing, e quem passa por cima dele está indo para a próxima seção.
      scrollWheelZoom: false,
      maxZoom: ZOOM_MAXIMO,
    });

    L.tileLayer(TILES, { attribution: CREDITO, maxZoom: ZOOM_MAXIMO }).addTo(instancia);

    instancia.fitBounds(L.latLngBounds(pracas.map((praca) => praca.coordenada)), {
      padding: FOLGA_DO_ENQUADRAMENTO,
    });

    camada.current = L.layerGroup().addTo(instancia);
    mapa.current = instancia;

    // Chama o ref, não a função deste render: o agrupamento depende da
    // distância em pixels, então cada zoom e cada arrasto refaz o desenho.
    const redesenhar = () => desenhar.current();
    // Copiado para o cleanup: o aviso do lint é justo, o ref pode apontar para
    // outro Map na hora em que o efeito for desfeito.
    const registro = marcadores.current;
    redesenhar();
    instancia.on("zoomend moveend", redesenhar);

    return () => {
      instancia.off("zoomend moveend", redesenhar);
      instancia.remove();
      mapa.current = null;
      camada.current = null;
      registro.clear();
    };
    // Monta uma vez; as atualizações vão pelos efeitos abaixo. O componente só
    // existe quando há praças (ver `MapaDePracas`), então `fitBounds` sempre
    // recebe ao menos uma coordenada.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Destaque: acende a classe no ícone que já está na tela. Recriar os
  // marcadores aqui fecharia o balão aberto no meio do clique.
  useEffect(() => {
    marcadores.current.forEach((marcador, nome) => {
      const icone = marcador.getElement()?.querySelector(".pino-praca");
      icone?.classList.toggle("em-foco", nome === destacada);
    });
  }, [destacada]);

  useEffect(() => {
    desenhar.current();
  }, [pracas]);

  // Escolher uma praça aproxima até o nível de rua e abre o balão dela. O voo
  // é a resposta ao clique: pular direto para o zoom desorienta.
  useEffect(() => {
    const instancia = mapa.current;
    if (!instancia || !visao.alvo) return;

    const praca = pracas.find((item) => item.nome === visao.alvo);
    if (!praca) return;

    const semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    aberta.current = praca.nome;
    instancia.flyTo(praca.coordenada, ZOOM_DA_CIDADE, {
      animate: !semMovimento,
      duration: 0.9,
    });

    // O balão só abre no fim do voo: o marcador é recriado a cada quadro do
    // agrupamento, e abrir antes o deixaria para trás.
    const abrirNoFim = () => marcadores.current.get(praca.nome)?.openPopup();
    instancia.once("moveend", abrirNoFim);

    return () => {
      instancia.off("moveend", abrirNoFim);
    };
  }, [visao, pracas]);

  // Voltar ao mapa inteiro.
  useEffect(() => {
    const instancia = mapa.current;
    if (!instancia || visao.pedido === 0 || visao.alvo !== null) return;

    aberta.current = null;
    instancia.closePopup();
    instancia.fitBounds(L.latLngBounds(pracas.map((praca) => praca.coordenada)), {
      padding: FOLGA_DO_ENQUADRAMENTO,
    });
  }, [visao, pracas]);

  return (
    <div
      ref={caixa}
      onClick={(evento) => {
        // O balão é montado fora do React. Interceptar o clique mantém a
        // navegação no router, com a mesma transição do resto do site.
        const alvo = (evento.target as HTMLElement).closest<HTMLAnchorElement>(
          ".balao-praca a",
        );
        if (!alvo) return;

        evento.preventDefault();
        routerRef.current.push(alvo.getAttribute("href") ?? "/properties");
      }}
      // O Leaflet empilha painéis com z-index alto; sem isto o mapa passa por
      // cima do cabeçalho quando a página rola.
      style={{ zIndex: 0, position: "relative" }}
      className={`mapa-pracas ${CAIXA_DO_MAPA}`}
    />
  );
}

/**
 * O balão é montado como nó, não como string. O nome da praça hoje vem do
 * bundle, mas a camada de serviço existe para voltar a ser rede um dia — e aí
 * interpolar em `innerHTML` viraria ponto de injeção.
 */
function balaoDaPraca(praca: Praca, endereco: string): HTMLElement {
  const raiz = document.createElement("div");
  raiz.className = "balao-praca";

  const titulo = document.createElement("strong");
  titulo.textContent = praca.nome;

  const quantos = document.createElement("p");
  quantos.textContent = `${contarImoveis(praca.imoveis)} ${
    praca.imoveis === 1 ? "disponível" : "disponíveis"
  }`;

  const acao = document.createElement("a");
  acao.href = endereco;
  acao.textContent = `Ver imóveis em ${praca.nome.split(" ")[0]}`;

  raiz.append(titulo, quantos, acao);
  return raiz;
}
