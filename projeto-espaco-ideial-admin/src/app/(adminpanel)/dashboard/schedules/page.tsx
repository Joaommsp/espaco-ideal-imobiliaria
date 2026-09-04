"use client";

import { IconCalendarOff, IconExternalLink, IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ConfirmarExclusao } from "@/components/painel/ConfirmarExclusao";
import { Metricas, TopoDaPagina } from "@/components/painel/TopoDaPagina";
import { Botao } from "@/components/ui/Botao";
import { CarregandoPagina } from "@/components/ui/Carregando";
import { Segmentado } from "@/components/ui/Segmentado";
import { excluirAgendamento, listarAgendamentos, type Agendamento } from "@/lib/services/api";
import { partesDaData } from "@/lib/utils/formatters";

type Situacao = "carregando" | "pronto" | "erro";
type Recorte = "proximas" | "passadas" | "todas";

const SEM_AGENDAMENTOS: Agendamento[] = [];

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:2000";

export default function PaginaDeAgendamentos() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>(SEM_AGENDAMENTOS);
  const [situacao, setSituacao] = useState<Situacao>("carregando");
  const [erro, setErro] = useState("");
  const [recorte, setRecorte] = useState<Recorte>("proximas");
  const [paraExcluir, setParaExcluir] = useState<Agendamento | null>(null);
  const [excluindo, setExcluindo] = useState(false);
  const [erroDaExclusao, setErroDaExclusao] = useState("");

  const carregar = useCallback(async () => {
    setSituacao("carregando");

    try {
      setAgendamentos(await listarAgendamentos());
      setSituacao("pronto");
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : "Erro ao carregar as visitas.");
      setSituacao("erro");
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const ordenados = useMemo(
    () => [...agendamentos].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [agendamentos],
  );

  const proximas = ordenados.filter((visita) => !partesDaData(visita.date).jaPassou);
  const passadas = ordenados.filter((visita) => partesDaData(visita.date).jaPassou).reverse();
  const deHoje = ordenados.filter((visita) => partesDaData(visita.date).ehHoje);

  const visiveis = recorte === "proximas" ? proximas : recorte === "passadas" ? passadas : ordenados;

  async function confirmarExclusao() {
    if (!paraExcluir) {
      return;
    }

    setExcluindo(true);
    setErroDaExclusao("");

    try {
      await excluirAgendamento(paraExcluir.id);
      setParaExcluir(null);
      await carregar();
    } catch (falha) {
      setErroDaExclusao(falha instanceof Error ? falha.message : "Não foi possível excluir.");
    } finally {
      setExcluindo(false);
    }
  }

  return (
    <>
      <TopoDaPagina
        titulo="Agendamentos"
        resumo={
          situacao === "pronto"
            ? `${proximas.length} ${proximas.length === 1 ? "visita marcada" : "visitas marcadas"}`
            : "Carregando a agenda…"
        }
      />

      <div className="px-6 py-5">
        {situacao === "carregando" ? <CarregandoPagina rotulo="Carregando a agenda" /> : null}

        {situacao === "erro" ? (
          <div role="alert" className="rounded-cartao border border-laranja/30 bg-laranja-fraco px-6 py-10 text-center">
            <h2 className="font-display text-xl">Não conseguimos carregar a agenda</h2>
            <p className="mx-auto mt-2 max-w-[52ch] text-sm text-tinta-suave">{erro}</p>
            <Botao className="mt-5" onClick={carregar}>
              Tentar novamente
            </Botao>
          </div>
        ) : null}

        {situacao === "pronto" ? (
          <>
            <Metricas
              itens={[
                { valor: String(deHoje.length), rotulo: "visitas hoje" },
                { valor: String(proximas.length), rotulo: "próximas visitas" },
                { valor: String(passadas.length), rotulo: "já realizadas" },
                { valor: String(agendamentos.length), rotulo: "total registrado" },
              ]}
            />

            <div className="mb-4">
              <Segmentado
                rotulo="Mostrar"
                valor={recorte}
                aoEscolher={(valor) => setRecorte(valor as Recorte)}
                opcoes={[
                  { valor: "proximas", rotulo: `Próximas (${proximas.length})` },
                  { valor: "passadas", rotulo: `Passadas (${passadas.length})` },
                  { valor: "todas", rotulo: "Todas" },
                ]}
              />
            </div>

            {visiveis.length === 0 ? (
              <div className="rounded-[12px] border border-dashed border-areia-linha bg-white px-6 py-14 text-center">
                <span className="mx-auto grid size-12 place-items-center rounded-full bg-areia-escura text-tinta-fraca">
                  <IconCalendarOff size={22} stroke={1.6} />
                </span>
                <h2 className="mt-4 font-display text-xl">
                  {recorte === "proximas" ? "Nenhuma visita marcada" : "Nada por aqui"}
                </h2>
                <p className="mx-auto mt-2 max-w-[44ch] text-sm text-tinta-suave">
                  {recorte === "proximas"
                    ? "Quando alguém agendar uma visita pelo site, ela aparece aqui."
                    : "Não há registros neste recorte."}
                </p>
              </div>
            ) : (
              <ul className="grid gap-2.5">
                {visiveis.map((visita) => {
                  const data = partesDaData(visita.date);

                  return (
                    <li
                      key={visita.id}
                      className={[
                        "flex items-center gap-4 rounded-[11px] border border-areia-linha bg-white px-4 py-3",
                        data.ehHoje ? "shadow-[0_0_0_1px_theme(colors.laranja.DEFAULT)]" : "",
                        data.jaPassou ? "opacity-70" : "",
                      ].join(" ")}
                    >
                      <span className="w-14 shrink-0 text-center">
                        <b className="block font-display text-2xl leading-none">{data.dia}</b>
                        <span className="text-[0.68rem] uppercase tracking-[0.06em] text-tinta-fraca">
                          {data.mes} · {data.diaDaSemana}
                        </span>
                      </span>

                      <span
                        aria-hidden
                        className={[
                          "w-[3px] self-stretch rounded-sm",
                          data.ehHoje ? "bg-laranja" : "bg-tinta-fraca/40",
                        ].join(" ")}
                      />

                      <span className="min-w-0 flex-1">
                        <b className="block text-[0.92rem]">
                          {visita.userName}
                          {data.ehHoje ? (
                            <span className="ml-2 text-[0.66rem] font-bold uppercase tracking-[0.08em] text-laranja">
                              hoje
                            </span>
                          ) : null}
                        </b>
                        <small className="block truncate text-[0.8rem] text-tinta-fraca">
                          {visita.propertyAdress}
                        </small>
                      </span>

                      <span className="shrink-0 tabular-nums text-[0.86rem] text-tinta-suave">
                        {data.hora}
                      </span>

                      <Link
                        href={`${SITE}/properties/${visita.propertyId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="grid size-9 shrink-0 place-items-center rounded-lg text-tinta-fraca transition-colors hover:bg-areia-escura hover:text-tinta"
                        aria-label="Abrir o imóvel no site"
                      >
                        <IconExternalLink size={17} stroke={1.8} />
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setParaExcluir(visita);
                          setErroDaExclusao("");
                        }}
                        aria-label={`Excluir a visita de ${visita.userName}`}
                        className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-lg text-tinta-fraca transition-colors hover:bg-[#FBEAE8] hover:text-[#C42B1C]"
                      >
                        <IconTrash size={17} stroke={1.8} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        ) : null}
      </div>

      {paraExcluir ? (
        <ConfirmarExclusao
          descricao={`Visita de ${paraExcluir.userName} em ${partesDaData(paraExcluir.date).dia}/${partesDaData(paraExcluir.date).mes}`}
          excluindo={excluindo}
          erro={erroDaExclusao}
          aoConfirmar={confirmarExclusao}
          aoCancelar={() => setParaExcluir(null)}
        />
      ) : null}
    </>
  );
}
