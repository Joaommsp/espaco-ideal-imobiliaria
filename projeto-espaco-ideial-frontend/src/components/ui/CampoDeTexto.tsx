"use client";

import { useId, useState, type ComponentPropsWithoutRef } from "react";
import { MICRO_ROTULO } from "@/lib/utils/estilos";

interface CampoDeTextoProps
  extends Omit<ComponentPropsWithoutRef<"input">, "className" | "id"> {
  rotulo: string;
  erro?: string;
  dica?: string;
}

const BASE_CAMPO =
  "w-full rounded-[9px] border-0 bg-white px-3.5 py-3 text-[0.95rem] text-tinta shadow-[0_0_0_1px_rgba(15,19,23,0.1),0_1px_2px_rgba(15,19,23,0.06)] outline-none transition-shadow duration-150 placeholder:text-tinta-fraca/70 focus:shadow-[0_0_0_3px_rgba(10,132,255,0.35),0_0_0_1px_#0A84FF] disabled:opacity-60";

/** Campo no vocabulário do macOS: anel azul no foco, sem borda desenhada. */
export function CampoDeTexto({ rotulo, erro, dica, ...props }: CampoDeTextoProps) {
  const id = useId();
  const idAuxiliar = `${id}-auxiliar`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={MICRO_ROTULO}>
        {rotulo}
      </label>
      <input
        id={id}
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro || dica ? idAuxiliar : undefined}
        className={[BASE_CAMPO, erro ? "shadow-[0_0_0_1px_#D14711]" : ""].filter(Boolean).join(" ")}
        {...props}
      />
      {erro ? (
        <p id={idAuxiliar} className="animate-surgir text-[0.8rem] font-medium text-laranja-escuro">
          {erro}
        </p>
      ) : dica ? (
        <p id={idAuxiliar} className="text-[0.8rem] text-tinta-fraca">
          {dica}
        </p>
      ) : null}
    </div>
  );
}

/** Senha com o olho de mostrar/ocultar, mantendo o mesmo desenho do campo. */
export function CampoDeSenha({ rotulo, erro, dica, ...props }: CampoDeTextoProps) {
  const id = useId();
  const idAuxiliar = `${id}-auxiliar`;
  const [visivel, setVisivel] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={MICRO_ROTULO}>
        {rotulo}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visivel ? "text" : "password"}
          aria-invalid={erro ? true : undefined}
          aria-describedby={erro || dica ? idAuxiliar : undefined}
          className={[BASE_CAMPO, "pr-11", erro ? "shadow-[0_0_0_1px_#D14711]" : ""]
            .filter(Boolean)
            .join(" ")}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisivel((atual) => !atual)}
          aria-label={visivel ? "Ocultar a senha" : "Mostrar a senha"}
          className="absolute right-1 top-1/2 grid size-9 -translate-y-1/2 cursor-pointer place-items-center rounded-full text-tinta-fraca transition-colors hover:bg-areia-escura hover:text-tinta"
        >
          <span aria-hidden className="text-[0.95rem]">
            {visivel ? "🙈" : "👁"}
          </span>
        </button>
      </div>
      {erro ? (
        <p id={idAuxiliar} className="animate-surgir text-[0.8rem] font-medium text-laranja-escuro">
          {erro}
        </p>
      ) : dica ? (
        <p id={idAuxiliar} className="text-[0.8rem] text-tinta-fraca">
          {dica}
        </p>
      ) : null}
    </div>
  );
}
