"use client";

import Image from "next/image";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import type { Imovel } from "@/lib/types/imovel";
import { formatarArea, formatarBRL } from "@/lib/utils/formatters";
import { urlDaFoto } from "@/lib/utils/foto";
import { ehLocacao, localDoImovel, tituloDoImovel } from "@/lib/utils/imovel";

export function TabelaDeImoveis({
  imoveis,
  aoEditar,
  aoExcluir,
}: {
  imoveis: Imovel[];
  aoEditar: (imovel: Imovel) => void;
  aoExcluir: (imovel: Imovel) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[0.88rem]">
        <thead>
          <tr>
            {["Imóvel", "Referência", "Negócio", "Preço", "Ficha"].map((coluna) => (
              <th
                key={coluna}
                className="whitespace-nowrap border-b border-areia-linha bg-areia px-4 py-3 text-left text-[0.68rem] font-bold uppercase tracking-[0.1em] text-tinta-fraca"
              >
                {coluna}
              </th>
            ))}
            <th className="border-b border-areia-linha bg-areia px-4 py-3 text-right text-[0.68rem] font-bold uppercase tracking-[0.1em] text-tinta-fraca">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {imoveis.map((imovel) => (
            <tr key={imovel.id} className="border-b border-areia-escura transition-colors last:border-0 hover:bg-areia">
              <td className="px-4 py-3">
                <span className="flex min-w-[250px] items-center gap-3">
                  <Image
                    src={urlDaFoto(imovel.urlImagem)}
                    alt=""
                    width={56}
                    height={42}
                    className="size-auto h-[42px] w-14 shrink-0 rounded-md object-cover"
                  />
                  <span className="min-w-0">
                    <b className="block truncate text-[0.9rem] font-semibold">
                      {tituloDoImovel(imovel)}
                    </b>
                    <small className="block truncate text-[0.78rem] text-tinta-fraca">
                      {localDoImovel(imovel)}
                    </small>
                  </span>
                </span>
              </td>

              <td className="px-4 py-3 font-mono text-[0.78rem] text-tinta-fraca">
                {imovel.registro}
              </td>

              <td className="px-4 py-3">
                <span
                  className={[
                    "inline-block rounded-full px-2 py-0.5 text-[0.7rem] font-semibold",
                    ehLocacao(imovel)
                      ? "bg-areia-escura text-tinta-suave"
                      : "bg-laranja-fraco text-laranja-escuro",
                  ].join(" ")}
                >
                  {imovel.transacao?.nomeTransacao ?? "—"}
                </span>
              </td>

              <td className="whitespace-nowrap px-4 py-3 font-semibold tabular-nums">
                {formatarBRL(imovel.preco)}
                {ehLocacao(imovel) ? (
                  <span className="text-[0.76rem] font-normal text-tinta-fraca">/mês</span>
                ) : null}
              </td>

              <td className="whitespace-nowrap px-4 py-3 tabular-nums text-tinta-suave">
                {imovel.qtdQuartos}q · {imovel.qtdVagasGaragem}v · {formatarArea(imovel.area)}
              </td>

              <td className="px-4 py-3">
                <span className="flex justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => aoEditar(imovel)}
                    aria-label={`Editar ${imovel.registro}`}
                    className="grid size-8 cursor-pointer place-items-center rounded-lg text-tinta-fraca transition-colors hover:bg-areia-escura hover:text-tinta"
                  >
                    <IconPencil size={17} stroke={1.8} />
                  </button>
                  <button
                    type="button"
                    onClick={() => aoExcluir(imovel)}
                    aria-label={`Excluir ${imovel.registro}`}
                    className="grid size-8 cursor-pointer place-items-center rounded-lg text-tinta-fraca transition-colors hover:bg-[#FBEAE8] hover:text-[#C42B1C]"
                  >
                    <IconTrash size={17} stroke={1.8} />
                  </button>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
