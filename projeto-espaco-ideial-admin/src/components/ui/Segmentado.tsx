"use client";

export interface SegmentoOpcao {
  valor: number | string;
  rotulo: string;
}

/**
 * Controle segmentado do macOS: para poucas opções, escolher com um toque é
 * mais rápido que abrir um menu.
 */
export function Segmentado({
  rotulo,
  valor,
  opcoes,
  aoEscolher,
}: {
  rotulo: string;
  valor: number | string;
  opcoes: SegmentoOpcao[];
  aoEscolher: (valor: number | string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[0.66rem] font-bold uppercase tracking-[0.1em] text-tinta-fraca">
        {rotulo}
      </span>
      <div
        role="group"
        aria-label={rotulo}
        className="inline-flex rounded-[9px] bg-tinta/[0.06] p-0.5 shadow-[inset_0_0_0_1px_rgba(15,19,23,0.05)]"
      >
        {opcoes.map((opcao) => {
          const ativo = opcao.valor === valor;

          return (
            <button
              key={opcao.valor}
              type="button"
              aria-pressed={ativo}
              onClick={() => aoEscolher(opcao.valor)}
              className={[
                "cursor-pointer rounded-[7px] px-4 py-1.5 text-[0.86rem] font-medium transition-all duration-200 ease-mola",
                ativo
                  ? "bg-white text-tinta shadow-[0_1px_3px_rgba(15,19,23,0.14),0_0_0_0.5px_rgba(15,19,23,0.06)]"
                  : "text-tinta-suave hover:text-tinta",
              ].join(" ")}
            >
              {opcao.rotulo}
            </button>
          );
        })}
      </div>
    </div>
  );
}
