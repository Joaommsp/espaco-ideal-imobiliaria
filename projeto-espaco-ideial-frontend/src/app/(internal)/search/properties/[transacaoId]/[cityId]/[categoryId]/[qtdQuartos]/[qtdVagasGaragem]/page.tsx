"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AvisoDeErro } from "@/components/imoveis/AvisoDeErro";
import { EsqueletoDeCards } from "@/components/imoveis/EsqueletoDeCards";
import { GradeDeImoveis } from "@/components/imoveis/GradeDeImoveis";
import { BotaoLink } from "@/components/ui/Botao";
import {
  buscarImoveis,
  listarCategorias,
  listarCidades,
  listarTransacoes,
} from "@/lib/services/imoveis";
import type { Imovel, Opcao } from "@/lib/types/imovel";

type Situacao = "carregando" | "pronto" | "erro";

const SEM_IMOVEIS: Imovel[] = [];
const SEM_OPCOES: Opcao[] = [];

function nomeDaOpcao(lista: Opcao[], id: number): string | null {
  return lista.find((opcao) => opcao.id === id)?.nome ?? null;
}

export default function PaginaDeBusca() {
  const parametros = useParams<{
    transacaoId: string;
    cityId: string;
    categoryId: string;
    qtdQuartos: string;
    qtdVagasGaragem: string;
  }>();

  const [imoveis, setImoveis] = useState<Imovel[]>(SEM_IMOVEIS);
  const [cidades, setCidades] = useState<Opcao[]>(SEM_OPCOES);
  const [categorias, setCategorias] = useState<Opcao[]>(SEM_OPCOES);
  const [transacoes, setTransacoes] = useState<Opcao[]>(SEM_OPCOES);
  const [situacao, setSituacao] = useState<Situacao>("carregando");
  const [erro, setErro] = useState("");

  const carregar = useCallback(async () => {
    setSituacao("carregando");
    setErro("");

    try {
      const [resultado, listaCidades, listaCategorias, listaTransacoes] = await Promise.all([
        buscarImoveis(parametros),
        listarCidades(),
        listarCategorias(),
        listarTransacoes(),
      ]);
      setImoveis(resultado);
      setCidades(listaCidades);
      setCategorias(listaCategorias);
      setTransacoes(listaTransacoes);
      setSituacao("pronto");
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : "Erro ao buscar imóveis.");
      setSituacao("erro");
    }
  }, [parametros]);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const criterios = [
    nomeDaOpcao(transacoes, Number(parametros.transacaoId)),
    nomeDaOpcao(categorias, Number(parametros.categoryId)),
    nomeDaOpcao(cidades, Number(parametros.cityId)),
    `${parametros.qtdQuartos} ${Number(parametros.qtdQuartos) === 1 ? "quarto" : "quartos"}`,
    `${parametros.qtdVagasGaragem} ${Number(parametros.qtdVagasGaragem) === 1 ? "vaga" : "vagas"}`,
  ].filter(Boolean) as string[];

  return (
    <main className="min-h-dvh bg-areia">
      <header className="border-b border-areia-linha bg-white">
        <div className="mx-auto max-w-[1180px] px-6 py-10">
          <nav aria-label="Você está aqui" className="text-sm text-tinta-fraca">
            <Link href="/" className="hover:text-laranja">
              Início
            </Link>
            <span aria-hidden> / </span>
            <span className="text-tinta">Busca</span>
          </nav>

          <h1 className="mt-3 font-display text-[clamp(1.9rem,4vw,2.7rem)] font-semibold">
            Resultado da busca
          </h1>

          <ul className="mt-4 flex flex-wrap gap-2">
            {criterios.map((criterio) => (
              <li
                key={criterio}
                className="rounded-full bg-areia-escura px-3 py-1.5 text-[0.8rem] text-tinta-suave"
              >
                {criterio}
              </li>
            ))}
          </ul>

          <p className="mt-4 text-tinta-suave" aria-live="polite">
            {situacao === "pronto"
              ? `${imoveis.length} ${imoveis.length === 1 ? "imóvel encontrado" : "imóveis encontrados"}`
              : "Procurando…"}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-[1180px] px-6 py-8">
        {situacao === "carregando" ? <EsqueletoDeCards quantidade={3} /> : null}

        {situacao === "erro" ? <AvisoDeErro mensagem={erro} aoTentarNovamente={carregar} /> : null}

        {situacao === "pronto" ? (
          <GradeDeImoveis
            imoveis={imoveis}
            vazio={{
              titulo: "Nenhum imóvel com essa combinação",
              texto:
                "A busca exige todos os critérios ao mesmo tempo. Tente afrouxar um deles — menos quartos ou outra cidade — ou veja o catálogo inteiro.",
              acao: (
                <BotaoLink href="/properties" variante="laranja">
                  Ver todos os imóveis
                </BotaoLink>
              ),
            }}
          />
        ) : null}
      </div>
    </main>
  );
}
