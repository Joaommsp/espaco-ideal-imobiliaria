import type { ReactNode } from "react";

/**
 * Entrar e criar conta trazem a própria moldura, com a logo nos dois lados.
 * O cabeçalho antigo ficava sobreposto ao formulário e riscava a tela.
 */
export default function AuthenticationLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
