/** Enquanto a lista carrega: a tela mostra o formato do que vem, não um vazio. */
export function EsqueletoDeCards({ quantidade = 6 }: { quantidade?: number }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
      {Array.from({ length: quantidade }).map((_, indice) => (
        <div
          key={indice}
          className="overflow-hidden rounded-cartao border border-areia-linha bg-white"
        >
          <div className="aspect-[4/3] animate-pulse bg-areia-escura" />
          <div className="space-y-3 p-4">
            <div className="h-4 w-2/3 animate-pulse rounded bg-areia-escura" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-areia-escura" />
            <div className="h-3 w-full animate-pulse rounded bg-areia-escura" />
            <div className="h-7 w-1/3 animate-pulse rounded bg-areia-escura" />
          </div>
        </div>
      ))}
    </div>
  );
}
