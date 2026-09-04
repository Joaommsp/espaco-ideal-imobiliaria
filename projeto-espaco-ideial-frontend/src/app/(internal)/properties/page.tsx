"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AvisoDeErro } from "@/components/imoveis/AvisoDeErro";
import { EsqueletoDeCards } from "@/components/imoveis/EsqueletoDeCards";
import { GradeDeImoveis, type ModoDeExibicao } from "@/components/imoveis/GradeDeImoveis";
import { Botao } from "@/components/ui/Botao";
import { FaixaDePreco } from "@/components/ui/FaixaDePreco";
import { MenuDeOpcoes } from "@/components/ui/MenuDeOpcoes";
import { Paginacao } from "@/components/ui/Paginacao";
import { Segmentado } from "@/components/ui/Segmentado";
import {
  listarCategorias,
  listarCidades,
  listarImoveis,
  listarTransacoes,
} from "@/lib/services/imoveis";
import type { Imovel, Opcao } from "@/lib/types/imovel";

type Situacao = "carregando" | "pronto" | "erro";
type Ordem = "recentes" | "menor" | "maior" | "area";

/** Referências estáveis: nada de `[]` novo a cada render. */
const SEM_IMOVEIS: Imovel[] = [];
const SEM_OPCOES: Opcao[] = [];

const TODAS = 0;
const QUALQUER = 0;

/** Oito por página: enche a grade de 3 colunas sem exigir rolagem longa. */
const POR_PAGINA = 8;

const ORDENS: { valor: Ordem; rotulo: string }[] = [
  { valor: "recentes", rotulo: "Mais recentes" },
  { valor: "menor", rotulo: "Menor preço" },
  { valor: "maior", rotulo: "Maior preço" },
  { valor: "area", rotulo: "Maior área" },
];

export default function PaginaDeImoveis() {
  const [imoveis, setImoveis] = useState<Imovel[]>(SEM_IMOVEIS);
  const [cidades, setCidades] = useState<Opcao[]>(SEM_OPCOES);
  const [categorias, setCategorias] = useState<Opcao[]>(SEM_OPCOES);
  const [transacoes, setTransacoes] = useState<Opcao[]>(SEM_OPCOES);
  const [situacao, setSituacao] = useState<Situacao>("carregando");
  const [erro, setErro] = useState("");

  const [cidade, setCidade] = useState<number | string>(TODAS);
  const [categoria, setCategoria] = useState<number | string>(TODAS);
  const [transacao, setTransacao] = useState<number | string>(QUALQUER);
  const [quartosMinimos, setQuartosMinimos] = useState<number | string>(0);
  const [vagasMinimas, setVagasMinimas] = useState<number | string>(0);
  const [tetoDePreco, setTetoDePreco] = useState<number | null>(null);
  const [ordem, setOrdem] = useState<Ordem>("recentes");
  const [modo, setModo] = useState<ModoDeExibicao>("grade");
  const [pagina, setPagina] = useState(1);

  const carregar = useCallback(async () => {
    setSituacao("carregando");
    setErro("");

    try {
      const [lista, listaCidades, listaCategorias, listaTransacoes] = await Promise.all([
        listarImoveis(),
        listarCidades(),
        listarCategorias(),
        listarTransacoes(),
      ]);
      setImoveis(lista);
      setCidades(listaCidades);
      setCategorias(listaCategorias);
      setTransacoes(listaTransacoes);
      setSituacao("pronto");
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : "Erro desconhecido ao falar com a API.");
      setSituacao("erro");
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  // A faixa acompanha o catálogo: não faz sentido oferecer um teto de dez
  // milhões se o imóvel mais caro custa um.
  const precoMaximo = useMemo(
    () => (imoveis.length ? Math.ceil(Math.max(...imoveis.map((i) => i.preco)) / 10000) * 10000 : 0),
    [imoveis],
  );
  // Sem arredondar para baixo: com aluguel de R$ 1.650 no catálogo, o piso
  // virava R$ 0,00 e a faixa mentia sobre o que existe.
  const precoMinimo = useMemo(
    () => (imoveis.length ? Math.min(...imoveis.map((i) => i.preco)) : 0),
    [imoveis],
  );
  const teto = tetoDePreco ?? precoMaximo;

  const visiveis = useMemo(() => {
    const filtrados = imoveis.filter((imovel) => {
      if (cidade !== TODAS && imovel.cityId !== cidade) return false;
      if (categoria !== TODAS && imovel.categoryId !== categoria) return false;
      if (transacao !== QUALQUER && imovel.transacaoId !== transacao) return false;
      if (imovel.qtdQuartos < Number(quartosMinimos)) return false;
      if (imovel.qtdVagasGaragem < Number(vagasMinimas)) return false;
      if (precoMaximo > 0 && imovel.preco > teto) return false;
      return true;
    });

    const porOrdem: Record<Ordem, (a: Imovel, b: Imovel) => number> = {
      recentes: () => 0,
      menor: (a, b) => a.preco - b.preco,
      maior: (a, b) => b.preco - a.preco,
      area: (a, b) => b.area - a.area,
    };

    return [...filtrados].sort(porOrdem[ordem]);
  }, [
    imoveis,
    cidade,
    categoria,
    transacao,
    quartosMinimos,
    vagasMinimas,
    teto,
    precoMaximo,
    ordem,
  ]);

  const totalDePaginas = Math.max(1, Math.ceil(visiveis.length / POR_PAGINA));

  // Filtro novo com a lista menor deixaria a pessoa numa página que não existe.
  const paginaAtual = Math.min(pagina, totalDePaginas);
  const daPagina = visiveis.slice((paginaAtual - 1) * POR_PAGINA, paginaAtual * POR_PAGINA);

  function irPara(destino: number) {
    setPagina(destino);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const filtrosAtivos =
    cidade !== TODAS ||
    categoria !== TODAS ||
    transacao !== QUALQUER ||
    Number(quartosMinimos) > 0 ||
    Number(vagasMinimas) > 0 ||
    (tetoDePreco !== null && tetoDePreco < precoMaximo);

  function limparFiltros() {
    setCidade(TODAS);
    setCategoria(TODAS);
    setTransacao(QUALQUER);
    setQuartosMinimos(0);
    setVagasMinimas(0);
    setTetoDePreco(null);
    setOrdem("recentes");
    setPagina(1);
  }

  function contarNaCidade(id: number): string {
    const total = imoveis.filter((imovel) => imovel.cityId === id).length;
    return total > 0 ? String(total) : "";
  }

  return (
    <main className="min-h-dvh bg-areia">
      <header className="border-b border-areia-linha bg-white">
        <div className="mx-auto max-w-[1180px] px-6 py-10">
          <nav aria-label="Você está aqui" className="text-sm text-tinta-fraca">
            <Link href="/" className="hover:text-laranja">
              Início
            </Link>
            <span aria-hidden> / </span>
            <span className="text-tinta">Imóveis</span>
          </nav>
          <h1 className="mt-3 font-display text-[clamp(1.9rem,4vw,2.7rem)] font-semibold">
            Todos os imóveis
          </h1>
          <p className="mt-2 max-w-[54ch] text-tinta-suave">
            {situacao === "pronto"
              ? `${imoveis.length} ${imoveis.length === 1 ? "imóvel disponível" : "imóveis disponíveis"} para compra e locação.`
              : "Carregando o catálogo…"}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-[1180px] px-6 py-8">
        <div className="mb-7 flex flex-wrap items-end gap-4 rounded-cartao border border-areia-linha bg-white p-4">
          <Segmentado
            rotulo="Negócio"
            valor={transacao}
            aoEscolher={(valor) => { setTransacao(valor); setPagina(1); }}
            opcoes={[
              { valor: QUALQUER, rotulo: "Todos" },
              ...transacoes.map((opcao) => ({ valor: opcao.id, rotulo: opcao.nome })),
            ]}
          />

          <MenuDeOpcoes
            rotulo="Cidade"
            valor={cidade}
            aoEscolher={(valor) => { setCidade(valor); setPagina(1); }}
            opcoes={[
              { valor: TODAS, rotulo: "Todas as cidades" },
              ...cidades.map((opcao) => ({
                valor: opcao.id,
                rotulo: opcao.nome,
                detalhe: contarNaCidade(opcao.id),
              })),
            ]}
          />

          <MenuDeOpcoes
            rotulo="Tipo"
            valor={categoria}
            aoEscolher={(valor) => { setCategoria(valor); setPagina(1); }}
            opcoes={[
              { valor: TODAS, rotulo: "Todos os tipos" },
              ...categorias.map((opcao) => ({ valor: opcao.id, rotulo: opcao.nome })),
            ]}
          />

          <Segmentado
            rotulo="Quartos"
            valor={quartosMinimos}
            aoEscolher={(valor) => { setQuartosMinimos(valor); setPagina(1); }}
            opcoes={[
              { valor: 0, rotulo: "Qualquer" },
              { valor: 1, rotulo: "1+" },
              { valor: 2, rotulo: "2+" },
              { valor: 3, rotulo: "3+" },
              { valor: 4, rotulo: "4+" },
            ]}
          />

          <Segmentado
            rotulo="Vagas"
            valor={vagasMinimas}
            aoEscolher={(valor) => { setVagasMinimas(valor); setPagina(1); }}
            opcoes={[
              { valor: 0, rotulo: "Qualquer" },
              { valor: 1, rotulo: "1+" },
              { valor: 2, rotulo: "2+" },
              { valor: 3, rotulo: "3+" },
            ]}
          />

          {precoMaximo > 0 ? (
            <FaixaDePreco
              valor={teto}
              minimo={precoMinimo}
              maximo={precoMaximo}
              aoMudar={(valor) => { setTetoDePreco(valor); setPagina(1); }}
            />
          ) : null}

          <MenuDeOpcoes
            rotulo="Ordenar"
            valor={ordem}
            aoEscolher={(valor) => setOrdem(valor as Ordem)}
            larguraMinima="10rem"
            opcoes={ORDENS.map((item) => ({ valor: item.valor, rotulo: item.rotulo }))}
          />

          <div className="ml-auto flex items-center gap-3 self-center">
            <Segmentado
              rotulo="Exibir"
              valor={modo}
              aoEscolher={(valor) => setModo(valor as ModoDeExibicao)}
              opcoes={[
                { valor: "grade", rotulo: "Grade" },
                { valor: "lista", rotulo: "Lista" },
              ]}
            />
            {filtrosAtivos ? (
              <Botao variante="contorno" tamanho="compacto" onClick={limparFiltros}>
                Limpar
              </Botao>
            ) : null}
            <p className="text-sm text-tinta-fraca" aria-live="polite">
              {situacao === "pronto"
                ? `${visiveis.length} ${visiveis.length === 1 ? "resultado" : "resultados"}`
                : ""}
            </p>
          </div>
        </div>

        {situacao === "carregando" ? <EsqueletoDeCards /> : null}

        {situacao === "erro" ? <AvisoDeErro mensagem={erro} aoTentarNovamente={carregar} /> : null}

        {situacao === "pronto" ? (
          <GradeDeImoveis
            imoveis={daPagina}
            modo={modo}
            vazio={{
              titulo: "Nenhum imóvel com esses filtros",
              texto:
                "Não encontramos imóveis para a combinação escolhida. Tente afrouxar um dos critérios.",
              acao: (
                <Botao variante="contorno" onClick={limparFiltros}>
                  Limpar filtros
                </Botao>
              ),
            }}
          />
        ) : null}

        {situacao === "pronto" ? (
          <Paginacao pagina={paginaAtual} totalDePaginas={totalDePaginas} aoTrocar={irPara} />
        ) : null}
      </div>
    </main>
  );
}
