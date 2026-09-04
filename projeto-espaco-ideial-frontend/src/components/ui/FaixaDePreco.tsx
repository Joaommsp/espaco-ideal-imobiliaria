"use client";

import { formatarBRL } from "@/lib/utils/formatters";

/**
 * Teto de preço em vez de campo numérico: quem procura imóvel raramente sabe
 * o valor exato, mas sabe até quanto pode pagar.
 */
export function FaixaDePreco({
  valor,
  minimo,
  maximo,
  aoMudar,
  rotulo = "Até quanto",
}: {
  valor: number;
  minimo: number;
  maximo: number;
  aoMudar: (valor: number) => void;
  rotulo?: string;
}) {
  const percentual = maximo > minimo ? ((valor - minimo) / (maximo - minimo)) * 100 : 0;

  return (
    <div className="flex min-w-[14rem] flex-col gap-1.5">
      <span className="text-[0.66rem] font-bold uppercase tracking-[0.1em] text-tinta-fraca">
        {rotulo}
      </span>
      <input
        type="range"
        min={minimo}
        max={maximo}
        step={10000}
        value={valor}
        onChange={(evento) => aoMudar(Number(evento.target.value))}
        aria-label={rotulo}
        aria-valuetext={formatarBRL(valor)}
        className="faixa-preco h-1 w-full cursor-pointer appearance-none rounded-full"
        style={{
          background: `linear-gradient(90deg, #F25C26 0 ${percentual}%, rgba(15,19,23,0.14) ${percentual}% 100%)`,
        }}
      />
      <span className="flex justify-between text-[0.8rem] tabular-nums text-tinta-suave">
        <span>{formatarBRL(minimo)}</span>
        <b className="font-semibold text-tinta">{formatarBRL(valor)}</b>
      </span>
    </div>
  );
}
