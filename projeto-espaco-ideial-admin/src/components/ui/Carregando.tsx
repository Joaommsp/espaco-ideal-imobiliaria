/**
 * Spinner de traços do macOS: doze marcas apagando em sequência. Cada traço
 * é posicionado por rotação, e o atraso da animação faz a volta.
 */
const TRACOS = Array.from({ length: 12 }, (_, indice) => indice);

export function Carregando({
  rotulo = "Carregando",
  className,
}: {
  rotulo?: string;
  className?: string;
}) {
  return (
    <span
      role="status"
      aria-live="polite"
      className={["inline-flex items-center gap-3", className].filter(Boolean).join(" ")}
    >
      <span aria-hidden className="relative size-6">
        {TRACOS.map((indice) => (
          <span
            key={indice}
            className="absolute left-1/2 top-1/2 h-[7px] w-[2px] origin-[50%_9px] rounded-full bg-tinta-fraca animate-apagar motion-reduce:animate-none"
            style={{
              transform: `translate(-50%, -100%) rotate(${indice * 30}deg)`,
              animationDelay: `${(indice / TRACOS.length) * 0.8}s`,
            }}
          />
        ))}
      </span>
      <span className="sr-only">{rotulo}…</span>
    </span>
  );
}

/** Ocupa a altura da área de conteúdo enquanto a rota carrega. */
export function CarregandoPagina({ rotulo }: { rotulo?: string }) {
  return (
    <div className="grid min-h-[50vh] place-items-center">
      <Carregando rotulo={rotulo} />
    </div>
  );
}
