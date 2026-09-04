/** Cabeçalho branco de cada tela: título, resumo do que há e as ações. */
export function TopoDaPagina({
  titulo,
  resumo,
  acoes,
}: {
  titulo: string;
  resumo?: string;
  acoes?: React.ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-areia-linha bg-white px-6 py-5">
      <div>
        <h1 className="font-display text-[1.7rem] font-semibold">{titulo}</h1>
        {resumo ? <p className="mt-1 text-[0.88rem] text-tinta-fraca">{resumo}</p> : null}
      </div>
      {acoes ? <div className="flex items-center gap-2">{acoes}</div> : null}
    </header>
  );
}

export function Metricas({
  itens,
}: {
  itens: { valor: string; rotulo: string; destaque?: string }[];
}) {
  return (
    <dl className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
      {itens.map((item) => (
        <div key={item.rotulo} className="rounded-[11px] border border-areia-linha bg-white px-4 py-3.5">
          <dd className="font-display text-[1.7rem] font-semibold leading-none">{item.valor}</dd>
          <dt className="mt-1 text-[0.76rem] text-tinta-fraca">{item.rotulo}</dt>
          {item.destaque ? (
            <span className="mt-1.5 inline-block rounded-md bg-verde/10 px-1.5 py-0.5 text-[0.7rem] font-semibold text-verde">
              {item.destaque}
            </span>
          ) : null}
        </div>
      ))}
    </dl>
  );
}
