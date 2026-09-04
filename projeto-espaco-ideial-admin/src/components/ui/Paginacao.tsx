"use client";

import { Botao } from "@/components/ui/Botao";

/**
 * Paginação simples: primeira, última e as vizinhas da atual. Com poucas
 * páginas mostra todas; com muitas, resume com reticências.
 */
function paginasVisiveis(atual: number, total: number): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, indice) => indice + 1);
  }

  const paginas: (number | "...")[] = [1];
  const inicio = Math.max(2, atual - 1);
  const fim = Math.min(total - 1, atual + 1);

  if (inicio > 2) {
    paginas.push("...");
  }
  for (let pagina = inicio; pagina <= fim; pagina += 1) {
    paginas.push(pagina);
  }
  if (fim < total - 1) {
    paginas.push("...");
  }
  paginas.push(total);

  return paginas;
}

export function Paginacao({
  pagina,
  totalDePaginas,
  aoTrocar,
}: {
  pagina: number;
  totalDePaginas: number;
  aoTrocar: (pagina: number) => void;
}) {
  if (totalDePaginas <= 1) {
    return null;
  }

  return (
    <nav aria-label="Páginas de resultados" className="mt-9 flex items-center justify-center gap-2">
      <Botao
        variante="contorno"
        tamanho="compacto"
        disabled={pagina === 1}
        onClick={() => aoTrocar(pagina - 1)}
      >
        Anterior
      </Botao>

      <ul className="flex items-center gap-1">
        {paginasVisiveis(pagina, totalDePaginas).map((item, indice) =>
          item === "..." ? (
            <li key={`corte-${indice}`} aria-hidden className="px-2 text-tinta-fraca">
              …
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                onClick={() => aoTrocar(item)}
                aria-current={item === pagina ? "page" : undefined}
                className={[
                  "size-9 cursor-pointer rounded-[9px] text-[0.88rem] font-medium transition-colors",
                  item === pagina
                    ? "bg-grafite text-white"
                    : "text-tinta-suave hover:bg-areia-escura hover:text-tinta",
                ].join(" ")}
              >
                {item}
              </button>
            </li>
          ),
        )}
      </ul>

      <Botao
        variante="contorno"
        tamanho="compacto"
        disabled={pagina === totalDePaginas}
        onClick={() => aoTrocar(pagina + 1)}
      >
        Próxima
      </Botao>
    </nav>
  );
}
