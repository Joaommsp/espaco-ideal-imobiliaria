"use client";

import { IconAlertTriangle } from "@tabler/icons-react";
import { Botao } from "@/components/ui/Botao";
import { Carregando } from "@/components/ui/Carregando";

/**
 * Exclusão nomeia o que vai sumir e pede confirmação — antes o primeiro
 * clique já apagava, sem volta.
 */
export function ConfirmarExclusao({
  descricao,
  excluindo,
  erro,
  aoConfirmar,
  aoCancelar,
}: {
  descricao: string;
  excluindo: boolean;
  erro?: string;
  aoConfirmar: () => void;
  aoCancelar: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-grafite/50 p-4">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label="Confirmar exclusão"
        className="w-full max-w-[26rem] animate-menu rounded-[14px] bg-white p-6 shadow-[0_24px_60px_rgba(15,19,23,0.24)]"
      >
        <span className="grid size-11 place-items-center rounded-full bg-[#FBEAE8] text-[#C42B1C]">
          <IconAlertTriangle size={22} stroke={1.8} />
        </span>

        <h2 className="mt-4 font-display text-xl">Excluir este registro?</h2>
        <p className="mt-2 text-sm text-tinta-suave">
          <b className="text-tinta">{descricao}</b> será removido definitivamente. Não dá para
          desfazer.
        </p>

        {erro ? (
          <p role="alert" className="mt-3 animate-surgir text-sm font-medium text-laranja-escuro">
            {erro}
          </p>
        ) : null}

        <div className="mt-6 flex justify-end gap-2">
          <Botao variante="contorno" onClick={aoCancelar} disabled={excluindo}>
            Cancelar
          </Botao>
          <Botao
            onClick={aoConfirmar}
            disabled={excluindo}
            className="bg-[#C42B1C] hover:bg-[#A31F12]"
          >
            {excluindo ? <Carregando rotulo="Excluindo" /> : "Excluir"}
          </Botao>
        </div>
      </div>
    </div>
  );
}
