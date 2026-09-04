import Image from "next/image";
import Link from "next/link";
import type { Imovel } from "@/lib/types/imovel";
import { formatarArea, formatarBRL } from "@/lib/utils/formatters";
import { ehLocacao, localDoImovel, tituloDoImovel } from "@/lib/utils/imovel";

/**
 * Forma compacta do mesmo imóvel: cabe mais na tela e facilita comparar preço
 * e área lado a lado. Usa os mesmos dados do card, em outra disposição.
 */
export function LinhaDeImovel({ imovel }: { imovel: Imovel }) {
  const locacao = ehLocacao(imovel);

  return (
    <article className="group flex flex-col gap-4 border-b border-areia-linha bg-white p-3 transition-colors hover:bg-areia sm:flex-row sm:items-center">
      <Link
        href={`/properties/${imovel.id}`}
        className="relative h-28 w-full shrink-0 overflow-hidden rounded-[10px] bg-areia-escura sm:h-20 sm:w-32"
      >
        <Image
          src={imovel.urlImagem}
          alt=""
          fill
          sizes="(max-width: 640px) 92vw, 128px"
          className="object-cover"
        />
        <span
          className={[
            "absolute left-1.5 top-1.5 rounded-full px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider text-white",
            locacao ? "bg-grafite/85" : "bg-laranja",
          ].join(" ")}
        >
          {imovel.transacao?.nomeTransacao ?? "—"}
        </span>
      </Link>

      <div className="min-w-0 flex-1">
        <h3 className="truncate font-display text-base text-tinta">
          <Link href={`/properties/${imovel.id}`} className="hover:text-laranja">
            {tituloDoImovel(imovel)}
          </Link>
        </h3>
        <p className="truncate text-sm text-tinta-fraca">{localDoImovel(imovel)}</p>
      </div>

      <dl className="flex shrink-0 gap-4 text-[0.82rem] text-tinta-suave">
        <div className="flex gap-1">
          <dd className="font-semibold text-tinta">{imovel.qtdQuartos}</dd>
          <dt>{imovel.qtdQuartos === 1 ? "quarto" : "quartos"}</dt>
        </div>
        <div className="flex gap-1">
          <dd className="font-semibold text-tinta">{imovel.qtdVagasGaragem}</dd>
          <dt>{imovel.qtdVagasGaragem === 1 ? "vaga" : "vagas"}</dt>
        </div>
        <div className="flex gap-1">
          <dd className="font-semibold text-tinta">{formatarArea(imovel.area)}</dd>
          <dt className="sr-only">de área</dt>
        </div>
      </dl>

      <p className="shrink-0 text-right font-display text-lg font-semibold sm:w-44">
        {formatarBRL(imovel.preco)}
        {locacao ? (
          <span className="font-corpo text-xs font-medium text-tinta-fraca">/mês</span>
        ) : null}
      </p>

      <Link
        href={`/properties/${imovel.id}`}
        className="shrink-0 rounded-full bg-grafite px-4 py-2 text-center text-[0.78rem] font-semibold text-white transition-colors hover:bg-laranja"
      >
        Ver
      </Link>
    </article>
  );
}
