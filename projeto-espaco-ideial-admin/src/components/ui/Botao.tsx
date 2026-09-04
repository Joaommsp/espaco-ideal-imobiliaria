import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variante = "laranja" | "grafite" | "claro" | "vidro" | "contorno";
type Tamanho = "padrao" | "compacto" | "grande";

const BASE =
  "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full font-semibold transition-[transform,background-color,box-shadow] duration-150 ease-out active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60";

const VARIANTES: Record<Variante, string> = {
  laranja: "bg-laranja text-white hover:bg-laranja-escuro",
  grafite: "bg-grafite text-white hover:bg-laranja",
  claro: "bg-white text-grafite hover:bg-areia-escura",
  vidro: "bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.22)] hover:bg-white/20",
  contorno: "text-tinta shadow-[inset_0_0_0_1px_theme(colors.areia.linha)] hover:bg-areia-escura",
};

const TAMANHOS: Record<Tamanho, string> = {
  compacto: "px-4 py-2 text-[0.78rem]",
  padrao: "px-5 py-2.5 text-[0.84rem]",
  grande: "px-7 py-3.5 text-[0.92rem]",
};

function classes(variante: Variante, tamanho: Tamanho, extra?: string) {
  return [BASE, VARIANTES[variante], TAMANHOS[tamanho], extra].filter(Boolean).join(" ");
}

interface Comum {
  variante?: Variante;
  tamanho?: Tamanho;
  className?: string;
  children: ReactNode;
}

type BotaoLinkProps = Comum & { href: string; externo?: boolean } & Omit<
    ComponentPropsWithoutRef<"a">,
    "href" | "className" | "children"
  >;

export function BotaoLink({
  href,
  externo = false,
  variante = "laranja",
  tamanho = "padrao",
  className,
  children,
  ...props
}: BotaoLinkProps) {
  const estilo = classes(variante, tamanho, className);

  if (externo) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={estilo} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={estilo} {...props}>
      {children}
    </Link>
  );
}

type BotaoProps = Comum & Omit<ComponentPropsWithoutRef<"button">, "className" | "children">;

export function Botao({
  variante = "laranja",
  tamanho = "padrao",
  className,
  children,
  ...props
}: BotaoProps) {
  return (
    <button type="button" className={classes(variante, tamanho, className)} {...props}>
      {children}
    </button>
  );
}
