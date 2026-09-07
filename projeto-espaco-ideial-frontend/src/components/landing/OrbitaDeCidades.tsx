"use client";

import { useEffect, useRef } from "react";
import type { Praca } from "@/data/atuacao";
import { LADO_DO_GLOBO } from "./medidas-do-globo";

/**
 * Os cards das praças circulam o globo num anel inclinado. Ancorá-los na
 * coordenada real seria mais fiel, mas doze das catorze praças são do
 * Nordeste: no globo elas caem dentro de cem pixels e os cards viram um
 * borrão. Espaçados por igual, todos ganham a vez.
 */

/**
 * Raio horizontal do anel. O teto afasta os cards o suficiente para dois
 * vizinhos no topo do arco não se tocarem — é lá que eles mais se aproximam,
 * porque o cosseno varia rápido. A margem impede que o anel encoste na borda
 * da janela em tela estreita.
 */
const RAIO_MAXIMO = 440;
const MARGEM_DA_JANELA = 110;

function raioDaOrbita(larguraDaJanela: number): number {
  return Math.min(RAIO_MAXIMO, larguraDaJanela / 2 - MARGEM_DA_JANELA);
}

/**
 * Achatamento do anel, em radianos. Com 0,33 o arco sobe e desce ~143px em
 * torno do centro — cabe na altura que o hero reserva, sem cortar card.
 */
const INCLINACAO_DA_ORBITA = 0.33;

/** Uma volta completa. Longa de propósito: é pano de fundo, não protagonista. */
const VOLTA_MS = 24000;

/** Quem está atrás encolhe até este fator; quem vem à frente cresce até o outro. */
const ESCALA_MINIMA = 0.78;
const ESCALA_MAXIMA = 1.1;
const OPACIDADE_MINIMA = 0.34;

export function OrbitaDeCidades({ pracas }: { pracas: Praca[] }) {
  const cartoes = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const menosMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const centro = LADO_DO_GLOBO / 2;
    const total = pracas.length;

    const cosInclinacao = Math.cos(INCLINACAO_DA_ORBITA);
    const senInclinacao = Math.sin(INCLINACAO_DA_ORBITA);

    let raio = raioDaOrbita(window.innerWidth);
    let quadro = 0;

    function aoRedimensionar() {
      raio = raioDaOrbita(window.innerWidth);
    }

    window.addEventListener("resize", aoRedimensionar);

    /**
     * Posiciona por `transform`, fora do fluxo do React: a órbita muda a cada
     * quadro, e re-renderizar catorze componentes 60 vezes por segundo custaria
     * caro para não mudar nada além de duas coordenadas.
     */
    function posicionar(decorrido: number) {
      const anguloBase = (decorrido / VOLTA_MS) * Math.PI * 2;

      cartoes.current.forEach((cartao, indice) => {
        if (!cartao) return;

        const angulo = anguloBase + (indice / total) * Math.PI * 2;

        const x = Math.cos(angulo) * raio;
        const noPlano = Math.sin(angulo) * raio;
        const y = -noPlano * senInclinacao;
        const profundidade = noPlano * cosInclinacao;

        // 1 na frente da esfera, 0 atrás dela.
        const frente = (profundidade / raio + 1) / 2;
        const escala = ESCALA_MINIMA + frente * (ESCALA_MAXIMA - ESCALA_MINIMA);
        const atras = profundidade < 0;

        cartao.style.transform = `translate3d(${centro + x}px, ${centro + y}px, 0) translate(-50%, -50%) scale(${escala})`;
        cartao.style.opacity = String(OPACIDADE_MINIMA + frente * (1 - OPACIDADE_MINIMA));
        cartao.style.zIndex = atras ? "5" : "20";
        cartao.dataset.atras = String(atras);
      });
    }

    // Sem movimento, o anel fica parado e legível — os cards não somem.
    if (menosMovimento) {
      posicionar(0);
      return () => window.removeEventListener("resize", aoRedimensionar);
    }

    let inicio: number | null = null;

    function animar(agora: number) {
      inicio ??= agora;
      posicionar(agora - inicio);
      quadro = requestAnimationFrame(animar);
    }

    quadro = requestAnimationFrame(animar);

    return () => {
      cancelAnimationFrame(quadro);
      window.removeEventListener("resize", aoRedimensionar);
    };
  }, [pracas]);

  return (
    // O leitor de tela já recebe as praças na seção "Onde a gente atua"; aqui
    // seriam catorze rótulos em movimento repetindo a mesma informação.
    // Sem `transform` para centralizar: ele abriria um contexto de
    // empilhamento e prenderia o z-index dos cards aqui dentro — os que passam
    // atrás ficariam por cima do globo. O deslocamento vai no `left`.
    <ul
      aria-hidden
      className="pointer-events-none absolute top-0 hidden lg:block"
      style={{
        width: LADO_DO_GLOBO,
        height: LADO_DO_GLOBO,
        left: `calc(50% - ${LADO_DO_GLOBO / 2}px)`,
      }}
    >
      {pracas.map((praca, indice) => (
        <li
          key={praca.nome}
          ref={(elemento) => {
            cartoes.current[indice] = elemento;
          }}
          // A posição inicial vem do primeiro quadro; até lá ficam invisíveis
          // em vez de empilhados no canto.
          style={{ opacity: 0 }}
          className="group absolute left-0 top-0 flex items-baseline gap-2 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[0.7rem] shadow-cartao backdrop-blur-[2px] transition-colors duration-300 data-[atras=true]:bg-white/15 data-[atras=true]:shadow-none data-[atras=false]:bg-white/95 data-[atras=false]:text-grafite data-[atras=true]:text-white/80"
        >
          <b className="text-[0.78rem] font-semibold">{praca.nome}</b>
          <span className="text-tinta-fraca group-data-[atras=true]:text-white/50">
            {praca.imoveis} imóveis
          </span>
        </li>
      ))}
    </ul>
  );
}
