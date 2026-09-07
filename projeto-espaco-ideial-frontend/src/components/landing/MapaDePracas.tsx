"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Praca } from "@/data/atuacao";
import { CAIXA_DO_MAPA, MICRO_ROTULO } from "@/lib/utils/estilos";
import { contarImoveis } from "@/lib/utils/imovel";
import type { VisaoDoMapa } from "./TelaDoMapa";

/**
 * O Leaflet só é baixado quando a seção chega perto da tela. São ~42 KB que
 * não têm por que entrar no caminho da primeira pintura de uma landing cuja
 * dobra é o hero.
 */
const TelaDoMapa = dynamic(
  () => import("./TelaDoMapa").then((modulo) => modulo.TelaDoMapa),
  {
    ssr: false,
    loading: () => (
      <div className={`animate-pulse bg-areia-escura ${CAIXA_DO_MAPA}`} aria-label="Carregando o mapa" />
    ),
  },
);

/** Começa a carregar antes de aparecer, para o mapa já estar pronto na chegada. */
const ANTECEDENCIA = "300px";

const VISAO_INICIAL: VisaoDoMapa = { alvo: null, pedido: 0 };

export function MapaDePracas({ pracas }: { pracas: Praca[] }) {
  const secao = useRef<HTMLDivElement>(null);
  const [perto, setPerto] = useState(false);
  const [destacada, setDestacada] = useState<string | null>(null);
  const [visao, setVisao] = useState<VisaoDoMapa>(VISAO_INICIAL);

  useEffect(() => {
    const elemento = secao.current;
    if (!elemento || perto) return;

    // Sem IntersectionObserver (navegador antigo), carrega e pronto: melhor um
    // mapa pesado do que uma seção vazia.
    if (typeof IntersectionObserver === "undefined") {
      setPerto(true);
      return;
    }

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setPerto(true);
          observador.disconnect();
        }
      },
      { rootMargin: ANTECEDENCIA },
    );

    observador.observe(elemento);
    return () => observador.disconnect();
  }, [perto]);

  // Só as praças do catálogo entram no mapa: as internacionais não têm imóvel
  // cadastrado e o balão não teria para onde levar.
  const noMapa = useMemo(() => pracas.filter((praca) => praca.cidadeId !== undefined), [pracas]);

  const total = noMapa.reduce((soma, praca) => soma + praca.imoveis, 0);

  /** Cada escolha é uma ordem nova, mesmo repetindo a praça anterior. */
  function escolher(nome: string) {
    setVisao((atual) => ({ alvo: nome, pedido: atual.pedido + 1 }));
  }

  function verTodas() {
    setVisao((atual) => ({ alvo: null, pedido: atual.pedido + 1 }));
  }

  if (noMapa.length === 0) {
    return (
      <p className="mt-7 rounded-cartao border border-areia-linha bg-white px-4 py-8 text-center text-sm text-tinta-suave">
        Não conseguimos carregar as praças agora. Recarregue a página em instantes.
      </p>
    );
  }

  return (
    <div ref={secao} className="mt-7 grid gap-4 lg:grid-cols-[1.55fr_1fr]">
      {perto ? (
        <TelaDoMapa
          pracas={noMapa}
          destacada={destacada}
          aoDestacar={setDestacada}
          visao={visao}
          aoEscolher={escolher}
          enderecoDaCidade={(praca) => `/properties?cidade=${praca.cidadeId}`}
        />
      ) : (
        <div className={`bg-areia-escura ${CAIXA_DO_MAPA}`} />
      )}

      <div className="flex flex-col gap-2">
        <div className="flex items-baseline gap-3">
          <span className={MICRO_ROTULO}>
            {noMapa.length} praças · {contarImoveis(total)}
          </span>
          {visao.alvo ? (
            <button
              type="button"
              onClick={verTodas}
              className="ml-auto rounded-full text-xs font-semibold text-laranja underline-offset-4 hover:underline"
            >
              Ver todas
            </button>
          ) : null}
        </div>

        <ol className="flex flex-col overflow-y-auto rounded-cartao border border-areia-linha bg-white max-lg:max-h-[340px] lg:max-h-[430px]">
          {noMapa.map((praca) => (
            <li key={praca.nome} className="border-b border-areia-linha last:border-b-0">
              {/* Botão, não link: a lista aproxima o mapa naquela praça, e é o
                  balão que abre em seguida quem leva ao catálogo. */}
              <button
                type="button"
                onClick={() => escolher(praca.nome)}
                onMouseEnter={() => setDestacada(praca.nome)}
                onMouseLeave={() => setDestacada(null)}
                onFocus={() => setDestacada(praca.nome)}
                onBlur={() => setDestacada(null)}
                aria-pressed={visao.alvo === praca.nome}
                className={[
                  "flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm transition-colors",
                  destacada === praca.nome || visao.alvo === praca.nome
                    ? "bg-areia-escura"
                    : "hover:bg-areia-escura",
                ].join(" ")}
              >
                <span aria-hidden className="size-2.5 shrink-0 rounded-full bg-laranja" />
                <span>{praca.nome}</span>
                <span className="ml-auto text-xs tabular-nums text-tinta-fraca">
                  {contarImoveis(praca.imoveis)}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
