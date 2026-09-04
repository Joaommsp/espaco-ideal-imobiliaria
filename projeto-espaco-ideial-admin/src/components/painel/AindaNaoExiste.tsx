import { IconTool } from "@tabler/icons-react";
import Link from "next/link";
import { Botao, BotaoLink } from "@/components/ui/Botao";

/**
 * Tela honesta para o que ainda não foi construído: diz o que falta, o que dá
 * para fazer no lugar e para onde ir — em vez de deixar a pessoa num 404.
 */
export function AindaNaoExiste({
  recurso,
  explicacao,
  alternativa,
}: {
  recurso: string;
  explicacao: string;
  alternativa?: { texto: string; href: string; rotulo: string };
}) {
  return (
    <div className="grid min-h-[60vh] place-items-center px-6 py-12">
      <div className="max-w-[42ch] text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-areia-escura text-tinta-fraca">
          <IconTool size={26} stroke={1.6} />
        </span>

        <h1 className="mt-5 font-display text-2xl font-semibold">
          {recurso} ainda não tem tela
        </h1>
        <p className="mt-3 text-tinta-suave">{explicacao}</p>

        {alternativa ? (
          <>
            <p className="mt-5 text-sm text-tinta-fraca">{alternativa.texto}</p>
            <BotaoLink href={alternativa.href} variante="grafite" className="mt-4">
              {alternativa.rotulo}
            </BotaoLink>
          </>
        ) : null}
      </div>
    </div>
  );
}
