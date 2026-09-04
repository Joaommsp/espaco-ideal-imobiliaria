"use client";

import { useEffect, useId, useRef, useState } from "react";

export interface OpcaoDoMenu {
  valor: number | string;
  rotulo: string;
  /** Aparece à direita, em cinza — usado para a contagem de imóveis. */
  detalhe?: string;
  icone?: string;
}

interface MenuDeOpcoesProps {
  rotulo: string;
  valor: number | string;
  opcoes: OpcaoDoMenu[];
  aoEscolher: (valor: number | string) => void;
  larguraMinima?: string;
  desabilitado?: boolean;
}

/**
 * Menu no vocabulário do macOS: vidro fosco, marca de seleção e realce azul.
 * Existe porque o <select> nativo muda de cara em cada sistema e não aceita
 * ícone, contagem por opção nem estado próprio.
 *
 * Acessibilidade mantida à mão: setas navegam, Enter escolhe, Escape fecha e
 * o foco volta para o gatilho.
 */
export function MenuDeOpcoes({
  rotulo,
  valor,
  opcoes,
  aoEscolher,
  larguraMinima = "11rem",
  desabilitado = false,
}: MenuDeOpcoesProps) {
  const [aberto, setAberto] = useState(false);
  const [emFoco, setEmFoco] = useState(0);
  const caixa = useRef<HTMLDivElement>(null);
  const gatilho = useRef<HTMLButtonElement>(null);
  const idLista = useId();

  const escolhida = opcoes.find((opcao) => opcao.valor === valor);

  useEffect(() => {
    if (!aberto) {
      return;
    }

    function aoClicarFora(evento: MouseEvent) {
      if (!caixa.current?.contains(evento.target as Node)) {
        setAberto(false);
      }
    }

    document.addEventListener("mousedown", aoClicarFora);
    return () => document.removeEventListener("mousedown", aoClicarFora);
  }, [aberto]);

  function fechar() {
    setAberto(false);
    gatilho.current?.focus();
  }

  function escolher(opcao: OpcaoDoMenu) {
    aoEscolher(opcao.valor);
    fechar();
  }

  function aoTeclar(evento: React.KeyboardEvent) {
    if (evento.key === "Escape") {
      evento.preventDefault();
      fechar();
      return;
    }

    if (!aberto && (evento.key === "ArrowDown" || evento.key === "Enter" || evento.key === " ")) {
      evento.preventDefault();
      setAberto(true);
      setEmFoco(Math.max(0, opcoes.findIndex((opcao) => opcao.valor === valor)));
      return;
    }

    if (!aberto) {
      return;
    }

    if (evento.key === "ArrowDown") {
      evento.preventDefault();
      setEmFoco((atual) => (atual + 1) % opcoes.length);
    }
    if (evento.key === "ArrowUp") {
      evento.preventDefault();
      setEmFoco((atual) => (atual - 1 + opcoes.length) % opcoes.length);
    }
    if (evento.key === "Enter" || evento.key === " ") {
      evento.preventDefault();
      const opcao = opcoes[emFoco];
      if (opcao) {
        escolher(opcao);
      }
    }
  }

  return (
    <div ref={caixa} className="relative flex flex-col gap-1" onKeyDown={aoTeclar}>
      <span className="text-[0.66rem] font-bold uppercase tracking-[0.1em] text-tinta-fraca">
        {rotulo}
      </span>

      <button
        ref={gatilho}
        type="button"
        disabled={desabilitado}
        aria-haspopup="listbox"
        aria-expanded={aberto}
        aria-controls={aberto ? idLista : undefined}
        onClick={() => setAberto((atual) => !atual)}
        style={{ minWidth: larguraMinima }}
        className="flex cursor-pointer items-center justify-between gap-2.5 rounded-[9px] bg-white px-3 py-2.5 text-left text-[0.94rem] text-tinta shadow-[0_0_0_1px_rgba(15,19,23,0.1),0_1px_2px_rgba(15,19,23,0.08)] transition-[box-shadow,transform] duration-150 ease-mola hover:shadow-[0_0_0_1px_rgba(15,19,23,0.18),0_2px_5px_rgba(15,19,23,0.1)] active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-50 aria-expanded:shadow-[0_0_0_3px_rgba(10,132,255,0.35),0_0_0_1px_#0A84FF]"
      >
        <span className="truncate">{escolhida?.rotulo ?? "—"}</span>
        <span aria-hidden className="flex shrink-0 flex-col text-[0.6rem] leading-[0.5] text-tinta-fraca">
          <span>▲</span>
          <span>▼</span>
        </span>
      </button>

      {aberto ? (
        <ul
          id={idLista}
          role="listbox"
          aria-label={rotulo}
          className="absolute left-0 top-[calc(100%+6px)] z-40 max-h-72 min-w-[14rem] animate-menu overflow-y-auto rounded-xl bg-white/75 p-1.5 shadow-[0_12px_32px_rgba(15,19,23,0.14),0_2px_6px_rgba(15,19,23,0.08),inset_0_0_0_1px_rgba(255,255,255,0.6)] backdrop-blur-xl backdrop-saturate-150"
        >
          {opcoes.map((opcao, indice) => {
            const selecionada = opcao.valor === valor;

            return (
              <li key={opcao.valor}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selecionada}
                  onMouseEnter={() => setEmFoco(indice)}
                  onClick={() => escolher(opcao)}
                  className={[
                    "flex w-full cursor-pointer items-center gap-2.5 rounded-[7px] px-2.5 py-2 text-left text-[0.92rem] transition-colors",
                    indice === emFoco ? "bg-[#0A84FF] text-white" : "text-tinta",
                  ].join(" ")}
                >
                  <span
                    aria-hidden
                    className={["w-3.5 shrink-0 text-[0.8rem]", selecionada ? "" : "opacity-0"].join(" ")}
                  >
                    ✓
                  </span>
                  {opcao.icone ? <span aria-hidden>{opcao.icone}</span> : null}
                  <span className="truncate">{opcao.rotulo}</span>
                  {opcao.detalhe ? (
                    <span
                      className={[
                        "ml-auto shrink-0 text-[0.82rem]",
                        indice === emFoco ? "text-white/70" : "text-tinta-fraca",
                      ].join(" ")}
                    >
                      {opcao.detalhe}
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
