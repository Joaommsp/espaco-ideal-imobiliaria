"use client";

import createGlobe from "cobe";
import { useEffect, useRef } from "react";
import { PRACAS } from "@/data/atuacao";

/** Lado fixo do desenho: o globo é quadrado e o container recorta o excedente. */
const LADO = 620;

/**
 * Globo das praças onde a imobiliária atua. COBE em canvas (5 KB) em vez de
 * uma engine 3D inteira — e o marcador carrega dado real: cada ponto é uma
 * cidade da lista de atuação.
 */
export function Globo() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const elemento = canvas.current;
    if (!elemento) {
      return;
    }

    const menosMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let fase = 0;
    let inicioDoArraste: number | null = null;
    let giroAlvo = 0;
    let giroAtual = 0;

    const globo = createGlobe(elemento, {
      devicePixelRatio: 2,
      width: LADO * 2,
      height: LADO * 2,
      phi: 0,
      theta: 0.25,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [1, 0.42, 0.18],
      glowColor: [1, 1, 1],
      markers: PRACAS.map((praca) => ({
        location: praca.coordenada,
        size: praca.imoveis > 80 ? 0.08 : 0.05,
      })),
      onRender: (estado: Record<string, unknown>) => {
        if (inicioDoArraste === null && !menosMovimento) {
          fase += 0.0035;
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
  }, []);

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
