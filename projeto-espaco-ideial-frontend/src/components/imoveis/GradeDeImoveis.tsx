import { CardDeImovel } from "@/components/ui/CardDeImovel";
import { LinhaDeImovel } from "@/components/ui/LinhaDeImovel";
import type { Imovel } from "@/lib/types/imovel";

export type ModoDeExibicao = "grade" | "lista";

interface GradeDeImoveisProps {
  imoveis: Imovel[];
  /** "lista" mostra a forma compacta, que cabe mais na tela. */
  modo?: ModoDeExibicao;
  /** Mensagem de lista vazia — muda conforme a origem (catálogo ou busca). */
  vazio?: { titulo: string; texto: string; acao?: React.ReactNode };
}

/**
 * Uma grade só para catálogo e busca: as duas telas mostram a mesma coisa e
 * precisam tratar lista vazia do mesmo jeito.
 */
export function GradeDeImoveis({ imoveis, modo = "grade", vazio }: GradeDeImoveisProps) {
  if (imoveis.length === 0) {
    return (
      <div className="rounded-cartao border border-dashed border-areia-linha bg-white px-6 py-16 text-center">
        <h2 className="font-display text-xl text-tinta">
          {vazio?.titulo ?? "Nenhum imóvel encontrado"}
        </h2>
        <p className="mx-auto mt-2 max-w-[46ch] text-sm text-tinta-suave">
          {vazio?.texto ?? "Tente outros filtros ou volte mais tarde."}
        </p>
        {vazio?.acao ? <div className="mt-6 flex justify-center">{vazio.acao}</div> : null}
      </div>
    );
  }

  if (modo === "lista") {
    return (
      <div className="overflow-hidden rounded-cartao border border-areia-linha bg-white">
        {imoveis.map((imovel) => (
          <LinhaDeImovel key={imovel.id} imovel={imovel} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {imoveis.map((imovel) => (
        <CardDeImovel key={imovel.id} imovel={imovel} />
      ))}
    </div>
  );
}
