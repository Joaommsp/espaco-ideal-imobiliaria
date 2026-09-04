import Image from "next/image";
import Link from "next/link";
import type { Imovel } from "@/lib/types/imovel";
import { formatarArea, formatarBRL } from "@/lib/utils/formatters";
import { ehLocacao, localDoImovel, tituloDoImovel } from "@/lib/utils/imovel";

/**
 * A peça que mais se repete no sistema: home, busca, favoritos e painel.
 * Mostra o que decide a escolha — tipo, local, quartos, vagas, área e preço —
 * e deixa o código de cadastro para a página de detalhe.
 */
export function CardDeImovel({
  imovel,
  href,
}: {
  imovel: Imovel;
  /** O painel usa outra rota para o mesmo imóvel — por isso não fica fixo aqui. */
  href?: string;
}) {
  const locacao = ehLocacao(imovel);
  const destino = href ?? `/properties/${imovel.id}`;

  return (
    <article className="group flex flex-col overflow-hidden rounded-cartao border border-areia-linha bg-white transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-cartao">
      <Link href={destino} className="relative block aspect-[4/3] overflow-hidden bg-areia-escura">
        <Image
          src={imovel.urlImagem}
          alt=""
          fill
          sizes="(max-width: 680px) 92vw, (max-width: 1080px) 45vw, 360px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span
          className={[
            "absolute left-3 top-3 rounded-full px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-wider text-white",
            locacao ? "bg-grafite/85" : "bg-laranja",
          ].join(" ")}
        >
          {imovel.transacao?.nomeTransacao ?? "Disponível"}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-4 pt-4">
        <h3 className="font-display text-lg leading-tight text-tinta">
          <Link href={destino} className="hover:text-laranja">
            {tituloDoImovel(imovel)}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-tinta-fraca">{localDoImovel(imovel)}</p>

        <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-areia-escura pt-3 text-[0.82rem] text-tinta-suave">
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

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <p className="font-display text-xl font-semibold text-tinta">
            {formatarBRL(imovel.preco)}
            {locacao ? <span className="font-corpo text-sm font-medium text-tinta-fraca">/mês</span> : null}
          </p>
          <Link
            href={destino}
            className="rounded-full bg-grafite px-4 py-2 text-[0.78rem] font-semibold text-white transition-colors hover:bg-laranja"
          >
            Ver imóvel
          </Link>
        </div>
      </div>
    </article>
  );
}
