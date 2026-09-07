import Image from "next/image";
import Link from "next/link";
import { BotaoLink } from "@/components/ui/Botao";
import { CONTATO } from "@/data/contato";
import { SECOES } from "@/data/navegacao";
// Duas versões da mesma logo: a original é preta e some no grafite do hero.
import logoClara from "../../../public/images/logo-full-horizontal-light.png";
import logoEscura from "../../../public/images/logo-full-horizontal-dark.png";

type Tom = "escuro" | "claro";

interface CabecalhoProps {
  /** "escuro" sobre o hero da landing; "claro" nas telas de conteúdo. */
  tom?: Tom;
  /** Botão extra à direita — o layout interno usa para abrir o menu. */
  acaoExtra?: React.ReactNode;
}

export function Cabecalho({ tom = "escuro", acaoExtra }: CabecalhoProps) {
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

        {/* Sem conta de usuário, falar com o corretor é a ação do cabeçalho. */}
        <div className="ml-auto flex items-center gap-3 md:ml-0">
          <BotaoLink
            href={CONTATO.whatsapp}
            externo
            variante={escuro ? "vidro" : "laranja"}
            tamanho="compacto"
          >
            Falar no WhatsApp
          </BotaoLink>
          {acaoExtra}
        </div>
      </div>
    </header>
  );
}
