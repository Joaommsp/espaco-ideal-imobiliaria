"use client";

import createGlobe from "cobe";
import { useEffect, useRef } from "react";
import type { Praca } from "@/data/atuacao";
import { INCLINACAO_DO_EIXO, LADO_DO_GLOBO as LADO } from "./medidas-do-globo";

/**
 * Radianos por quadro. A 60 fps dá uma volta a cada ~13 segundos: rápido o
 * bastante para se ver o movimento numa olhada, devagar o bastante para não
 * roubar a atenção do texto ao lado.
 */
const VELOCIDADE_DO_GIRO = 0.008;

/** Suficiente para o ponto se destacar sem borrar cidades vizinhas. */
const MARCADOR_MINIMO = 0.045;
const MARCADOR_MAXIMO = 0.09;

/**
 * O ponto cresce com o tamanho da carteira, mas em escala relativa ao maior
 * do conjunto — um limite fixo faria todas as praças brasileiras empatarem no
 * menor tamanho, que foi o que aconteceu enquanto o corte era "> 80 imóveis".
 */
function tamanhoDoMarcador(imoveis: number, maior: number): number {
  if (maior <= 0) return MARCADOR_MINIMO;

  const proporcao = imoveis / maior;
  return MARCADOR_MINIMO + proporcao * (MARCADOR_MAXIMO - MARCADOR_MINIMO);
}

/**
 * Globo das praças onde a imobiliária atua. COBE em canvas (5 KB) em vez de
 * uma engine 3D inteira — e cada marcador é uma praça de verdade, com a
 * contagem vinda do catálogo.
 */
export function Globo({ pracas }: { pracas: Praca[] }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const elemento = canvas.current;
    if (!elemento) {
      return;
    }

    const menosMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const maiorCarteira = Math.max(...pracas.map((praca) => praca.imoveis), 0);

    let fase = 0;
    let inicioDoArraste: number | null = null;
    let giroAlvo = 0;
    let giroAtual = 0;

    const globo = createGlobe(elemento, {
      devicePixelRatio: 2,
      width: LADO * 2,
      height: LADO * 2,
      phi: 0,
      theta: INCLINACAO_DO_EIXO,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [1, 0.42, 0.18],
      glowColor: [1, 1, 1],
      markers: pracas.map((praca) => ({
        location: praca.coordenada,
        size: tamanhoDoMarcador(praca.imoveis, maiorCarteira),
      })),
      onRender: (estado: Record<string, unknown>) => {
        if (inicioDoArraste === null && !menosMovimento) {
          fase += VELOCIDADE_DO_GIRO;
        }
        giroAtual += (giroAlvo - giroAtual) * 0.08;
        estado.phi = fase + giroAtual;
      },
    });

    function aoPressionar(evento: PointerEvent) {
      inicioDoArraste = evento.clientX - giroAlvo * 220;
      elemento!.style.cursor = "grabbing";
    }

    function aoSoltar() {
      inicioDoArraste = null;
      if (elemento) {
        elemento.style.cursor = "grab";
      }
    }

    function aoMover(evento: PointerEvent) {
      if (inicioDoArraste === null) {
        return;
      }
      giroAlvo = (evento.clientX - inicioDoArraste) / 220;
    }

    elemento.addEventListener("pointerdown", aoPressionar);
    window.addEventListener("pointerup", aoSoltar);
    window.addEventListener("pointermove", aoMover);
    elemento.style.cursor = "grab";

    return () => {
      globo.destroy();
      elemento.removeEventListener("pointerdown", aoPressionar);
      window.removeEventListener("pointerup", aoSoltar);
      window.removeEventListener("pointermove", aoMover);
    };
  }, [pracas]);

  return (
    <canvas
      ref={canvas}
      aria-hidden
      width={LADO * 2}
      height={LADO * 2}
      style={{ width: LADO, height: LADO }}
      className="absolute left-1/2 top-0 -translate-x-1/2"
    />
  );
}
