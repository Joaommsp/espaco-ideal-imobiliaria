"use client";

import {
  IconArrowRight,
  IconCalendarEvent,
  IconHome2,
  IconUsers,
} from "@tabler/icons-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Metricas, TopoDaPagina } from "@/components/painel/TopoDaPagina";
import { Botao } from "@/components/ui/Botao";
import { CarregandoPagina } from "@/components/ui/Carregando";
import { listarAgendamentos, listarImoveis, listarUsuarios, type Agendamento } from "@/lib/services/api";
import type { Imovel } from "@/lib/types/imovel";
import { formatarBRL, partesDaData } from "@/lib/utils/formatters";

type Situacao = "carregando" | "pronto" | "erro";

const SEM_IMOVEIS: Imovel[] = [];
const SEM_AGENDAMENTOS: Agendamento[] = [];

const ATALHOS = [
  {
    titulo: "Imóveis",
    texto: "Cadastrar, editar e tirar do ar",
    href: "/dashboard/properties",
    icone: IconHome2,
  },
  {
    titulo: "Agendamentos",
    texto: "Ver as visitas marcadas",
    href: "/dashboard/schedules",
    icone: IconCalendarEvent,
  },
  {
    titulo: "Usuários",
    texto: "Contas criadas pelo site",
    href: "/dashboard/users",
    icone: IconUsers,
  },
];

export default function PaginaInicialDoPainel() {
  const [imoveis, setImoveis] = useState<Imovel[]>(SEM_IMOVEIS);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>(SEM_AGENDAMENTOS);
  const [usuarios, setUsuarios] = useState(0);
  const [situacao, setSituacao] = useState<Situacao>("carregando");
  const [erro, setErro] = useState("");

  const carregar = useCallback(async () => {
    setSituacao("carregando");

    try {
      const [lista, visitas, contas] = await Promise.all([
        listarImoveis(),
        listarAgendamentos(),
        listarUsuarios(),
      ]);
      setImoveis(lista);
      setAgendamentos(visitas);
      setUsuarios(contas.length);
      setSituacao("pronto");
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : "Erro ao carregar o painel.");
      setSituacao("erro");
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const proximas = agendamentos
    .filter((visita) => !partesDaData(visita.date).jaPassou)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 4);

  const semFoto = imoveis.filter((imovel) => !imovel.urlImagem).length;

  return (
    <>
      <TopoDaPagina titulo="Visão geral" resumo="O que está acontecendo no sistema agora" />

      <div className="px-6 py-5">
        {situacao === "carregando" ? <CarregandoPagina rotulo="Carregando o painel" /> : null}

        {situacao === "erro" ? (
          <div role="alert" className="rounded-cartao border border-laranja/30 bg-laranja-fraco px-6 py-10 text-center">
            <h2 className="font-display text-xl">Não conseguimos carregar o painel</h2>
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
                { valor: String(imoveis.length), rotulo: "imóveis no catálogo" },
                {
                  valor: String(proximas.length),
                  rotulo: "visitas por vir",
                  destaque: proximas.some((v) => partesDaData(v.date).ehHoje) ? "há visita hoje" : undefined,
                },
                { valor: String(usuarios), rotulo: "contas de clientes" },
                {
                  valor: imoveis.length
                    ? formatarBRL(imoveis.reduce((soma, i) => soma + i.preco, 0) / imoveis.length)
                    : formatarBRL(0),
                  rotulo: "preço médio anunciado",
                },
              ]}
            />

            <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
              <section className="rounded-[12px] border border-areia-linha bg-white p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="font-display text-lg">Próximas visitas</h2>
                  <Link
                    href="/dashboard/schedules"
                    className="flex items-center gap-1 text-[0.84rem] text-tinta-suave hover:text-laranja"
                  >
                    Ver todas <IconArrowRight size={15} stroke={1.8} />
                  </Link>
                </div>

                {proximas.length === 0 ? (
                  <p className="py-6 text-center text-sm text-tinta-fraca">
                    Nenhuma visita marcada no momento.
                  </p>
                ) : (
                  <ul className="grid gap-2">
                    {proximas.map((visita) => {
                      const data = partesDaData(visita.date);

                      return (
                        <li
                          key={visita.id}
                          className="flex items-center gap-3 rounded-lg bg-areia px-3 py-2.5"
                        >
                          <span className="w-11 shrink-0 text-center">
                            <b className="block font-display text-lg leading-none">{data.dia}</b>
                            <span className="text-[0.64rem] uppercase text-tinta-fraca">
                              {data.mes}
                            </span>
                          </span>
                          <span className="min-w-0 flex-1">
                            <b className="block truncate text-[0.88rem]">{visita.userName}</b>
                            <small className="block truncate text-[0.78rem] text-tinta-fraca">
                              {visita.propertyAdress}
                            </small>
                          </span>
                          <span className="shrink-0 text-[0.82rem] tabular-nums text-tinta-suave">
                            {data.hora}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>

              <section className="grid gap-3">
                {ATALHOS.map((atalho) => {
                  const Icone = atalho.icone;

                  return (
                    <Link
                      key={atalho.href}
                      href={atalho.href}
                      className="flex items-center gap-3.5 rounded-[12px] border border-areia-linha bg-white px-5 py-4 transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-cartao"
                    >
                      <span className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-areia text-tinta">
                        <Icone size={20} stroke={1.8} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <b className="block font-display text-base">{atalho.titulo}</b>
                        <small className="block text-[0.82rem] text-tinta-fraca">{atalho.texto}</small>
                      </span>
                      <IconArrowRight size={17} stroke={1.8} className="shrink-0 text-tinta-fraca" />
                    </Link>
                  );
                })}

                {semFoto > 0 ? (
                  <p className="rounded-[12px] border border-laranja/30 bg-laranja-fraco px-5 py-4 text-[0.86rem] text-tinta-suave">
                    <b className="text-tinta">{semFoto}</b>{" "}
                    {semFoto === 1 ? "imóvel está" : "imóveis estão"} sem foto — no site eles
                    aparecem com o quadro vazio.
                  </p>
                ) : null}
              </section>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}
