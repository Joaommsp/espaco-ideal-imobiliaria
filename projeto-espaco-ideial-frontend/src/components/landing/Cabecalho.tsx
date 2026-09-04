import Image from "next/image";
import Link from "next/link";
import { BotaoLink } from "@/components/ui/Botao";
// Duas versões da mesma logo: a original é preta e some no grafite do hero.
import logoClara from "../../../public/images/logo-full-horizontal-light.png";
import logoEscura from "../../../public/images/logo-full-horizontal-dark.png";

const SECOES = [
  { rotulo: "Imóveis", href: "/properties" },
  { rotulo: "Cidades", href: "/#cidades" },
  { rotulo: "Como funciona", href: "/#como-funciona" },
  { rotulo: "Contato", href: "/#contato" },
];

type Tom = "escuro" | "claro";

interface CabecalhoProps {
  /** "escuro" sobre o hero da landing; "claro" nas telas de conteúdo. */
  tom?: Tom;
  /** Nome de quem está logado — quando ausente, mostra entrar/criar conta. */
  usuario?: string | null;
  acaoDeUsuario?: React.ReactNode;
}

export function Cabecalho({ tom = "escuro", usuario, acaoDeUsuario }: CabecalhoProps) {
  const escuro = tom === "escuro";

  return (
    <header
      className={[
        "relative z-30 border-b",
        escuro ? "border-white/10" : "border-areia-linha bg-white",
      ].join(" ")}
    >
      <div className="mx-auto flex max-w-[1180px] items-center gap-6 px-6 py-4">
        <Link href="/" className="flex shrink-0 items-center" aria-label="Espaço Ideal — início">
          <Image
            src={escuro ? logoClara : logoEscura}
            alt="Espaço Ideal Imobiliária"
            priority
            className="h-8 w-auto"
          />
        </Link>

        <nav
          aria-label="Principal"
          className={[
            "ml-auto hidden gap-6 text-sm md:flex",
            escuro ? "text-white/70" : "text-tinta-suave",
          ].join(" ")}
        >
          {SECOES.map((secao) => (
            <Link
              key={secao.href}
              href={secao.href}
              className={escuro ? "hover:text-white" : "hover:text-laranja"}
            >
              {secao.rotulo}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3 md:ml-0">
          {usuario ? (
            <>
              <span
                className={[
                  "hidden text-sm sm:inline",
                  escuro ? "text-white/70" : "text-tinta-suave",
                ].join(" ")}
              >
                Olá, <b className={escuro ? "text-white" : "text-tinta"}>{usuario}</b>
              </span>
              {acaoDeUsuario}
            </>
          ) : (
            <>
              <BotaoLink
                href="/login"
                variante={escuro ? "vidro" : "contorno"}
                tamanho="compacto"
              >
                Entrar
              </BotaoLink>
              <BotaoLink
                href="/register"
                variante="laranja"
                tamanho="compacto"
                className="hidden sm:inline-flex"
              >
                Criar conta
              </BotaoLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
