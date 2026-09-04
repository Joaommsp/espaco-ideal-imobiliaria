"use client";

import { IconPlus, IconSearch } from "@tabler/icons-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ConfirmarExclusao } from "@/components/painel/ConfirmarExclusao";
import { FormularioDeImovel } from "@/components/painel/FormularioDeImovel";
import { Metricas, TopoDaPagina } from "@/components/painel/TopoDaPagina";
import { TabelaDeImoveis } from "@/components/painel/TabelaDeImoveis";
import { Botao } from "@/components/ui/Botao";
import { CarregandoPagina } from "@/components/ui/Carregando";
import { MenuDeOpcoes } from "@/components/ui/MenuDeOpcoes";
import { Paginacao } from "@/components/ui/Paginacao";
import {
  excluirImovel,
  listarCategorias,
  listarCidades,
  listarImoveis,
  listarTransacoes,
} from "@/lib/services/api";
import type { Imovel, Opcao } from "@/lib/types/imovel";
import { formatarBRL, normalizarBusca } from "@/lib/utils/formatters";
import { tituloDoImovel } from "@/lib/utils/imovel";

type Situacao = "carregando" | "pronto" | "erro";

const SEM_IMOVEIS: Imovel[] = [];
const SEM_OPCOES: Opcao[] = [];
const TODAS = 0;
const POR_PAGINA = 10;

export default function PaginaDeImoveis() {
  const [imoveis, setImoveis] = useState<Imovel[]>(SEM_IMOVEIS);
  const [cidades, setCidades] = useState<Opcao[]>(SEM_OPCOES);
  const [categorias, setCategorias] = useState<Opcao[]>(SEM_OPCOES);
  const [transacoes, setTransacoes] = useState<Opcao[]>(SEM_OPCOES);
  const [situacao, setSituacao] = useState<Situacao>("carregando");
  const [erro, setErro] = useState("");

  const [busca, setBusca] = useState("");
  const [cidade, setCidade] = useState<number | string>(TODAS);
  const [categoria, setCategoria] = useState<number | string>(TODAS);
  const [transacao, setTransacao] = useState<number | string>(TODAS);
  const [pagina, setPagina] = useState(1);

  const [emEdicao, setEmEdicao] = useState<Imovel | null>(null);
  const [formularioAberto, setFormularioAberto] = useState(false);
  const [paraExcluir, setParaExcluir] = useState<Imovel | null>(null);
  const [excluindo, setExcluindo] = useState(false);
  const [erroDaExclusao, setErroDaExclusao] = useState("");

  const carregar = useCallback(async () => {
    setSituacao("carregando");

    try {
      const [lista, listaCidades, listaCategorias, listaTransacoes] = await Promise.all([
        listarImoveis(),
        listarCidades(),
        listarCategorias(),
        listarTransacoes(),
      ]);
      setImoveis(lista);
      setCidades(listaCidades);
      setCategorias(listaCategorias);
      setTransacoes(listaTransacoes);
      setSituacao("pronto");
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : "Erro ao carregar os imóveis.");
      setSituacao("erro");
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const filtrados = useMemo(() => {
    const termo = normalizarBusca(busca);

    return imoveis.filter((imovel) => {
      if (cidade !== TODAS && imovel.cityId !== cidade) return false;
      if (categoria !== TODAS && imovel.categoryId !== categoria) return false;
      if (transacao !== TODAS && imovel.transacaoId !== transacao) return false;
      if (!termo) return true;

      return [imovel.registro, imovel.endereco, imovel.city?.nomeCidade, imovel.descricao]
        .filter(Boolean)
        .some((campo) => normalizarBusca(String(campo)).includes(termo));
    });
  }, [imoveis, busca, cidade, categoria, transacao]);

  const totalDePaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const paginaAtual = Math.min(pagina, totalDePaginas);
  const daPagina = filtrados.slice((paginaAtual - 1) * POR_PAGINA, paginaAtual * POR_PAGINA);

  const maisCaro = imoveis.length ? Math.max(...imoveis.map((imovel) => imovel.preco)) : 0;
  const comFotoPropria = imoveis.filter((imovel) => imovel.urlImagem?.startsWith("/imoveis/")).length;

  async function confirmarExclusao() {
    if (!paraExcluir) {
      return;
    }

    setExcluindo(true);
    setErroDaExclusao("");

    try {
      await excluirImovel(paraExcluir.id);
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
        titulo="Imóveis"
        resumo={
          situacao === "pronto"
            ? `${imoveis.length} cadastrados · ${comFotoPropria} com foto própria`
            : "Carregando o catálogo…"
        }
        acoes={
          <Botao
            onClick={() => {
              setEmEdicao(null);
              setFormularioAberto(true);
            }}
          >
            <IconPlus size={17} stroke={2} />
            Novo imóvel
          </Botao>
        }
      />

      <div className="px-6 py-5">
        {situacao === "carregando" ? <CarregandoPagina rotulo="Carregando os imóveis" /> : null}

        {situacao === "erro" ? (
          <div role="alert" className="rounded-cartao border border-laranja/30 bg-laranja-fraco px-6 py-10 text-center">
            <h2 className="font-display text-xl">Não conseguimos carregar os imóveis</h2>
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
                { valor: String(imoveis.length), rotulo: "imóveis cadastrados" },
                { valor: String(cidades.length), rotulo: "cidades atendidas" },
                { valor: String(comFotoPropria), rotulo: "com foto própria" },
                { valor: formatarBRL(maisCaro), rotulo: "imóvel mais caro" },
              ]}
            />

            <div className="mb-4 flex flex-wrap items-end gap-2.5">
              <div className="relative min-w-[220px] flex-1">
                <IconSearch
                  size={15}
                  stroke={1.8}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-tinta-fraca"
                />
                <input
                  value={busca}
                  onChange={(evento) => {
                    setBusca(evento.target.value);
                    setPagina(1);
                  }}
                  placeholder="Buscar por endereço, referência ou cidade"
                  aria-label="Buscar imóveis"
                  className="w-full rounded-[9px] border-0 bg-white py-2.5 pl-9 pr-3 text-[0.9rem] shadow-[0_0_0_1px_rgba(15,19,23,0.1)] outline-none focus:shadow-[0_0_0_3px_rgba(10,132,255,0.35),0_0_0_1px_#0A84FF]"
                />
              </div>

              <MenuDeOpcoes
                rotulo="Cidade"
                valor={cidade}
                aoEscolher={(valor) => {
                  setCidade(valor);
                  setPagina(1);
                }}
                opcoes={[
                  { valor: TODAS, rotulo: "Todas as cidades" },
                  ...cidades.map((opcao) => ({ valor: opcao.id, rotulo: opcao.nome })),
                ]}
              />

              <MenuDeOpcoes
                rotulo="Tipo"
                valor={categoria}
                aoEscolher={(valor) => {
                  setCategoria(valor);
                  setPagina(1);
                }}
                opcoes={[
                  { valor: TODAS, rotulo: "Todos os tipos" },
                  ...categorias.map((opcao) => ({ valor: opcao.id, rotulo: opcao.nome })),
                ]}
              />

              <MenuDeOpcoes
                rotulo="Negócio"
                valor={transacao}
                larguraMinima="9rem"
                aoEscolher={(valor) => {
                  setTransacao(valor);
                  setPagina(1);
                }}
                opcoes={[
                  { valor: TODAS, rotulo: "Venda e locação" },
                  ...transacoes.map((opcao) => ({ valor: opcao.id, rotulo: opcao.nome })),
                ]}
              />
            </div>

            <div className="overflow-hidden rounded-[12px] border border-areia-linha bg-white">
              {daPagina.length === 0 ? (
                <div className="px-6 py-14 text-center">
                  <h2 className="font-display text-xl">Nenhum imóvel encontrado</h2>
                  <p className="mx-auto mt-2 max-w-[44ch] text-sm text-tinta-suave">
                    Ajuste a busca ou os filtros para ver outros cadastros.
                  </p>
                </div>
              ) : (
                <TabelaDeImoveis
                  imoveis={daPagina}
                  aoEditar={(imovel) => {
                    setEmEdicao(imovel);
                    setFormularioAberto(true);
                  }}
                  aoExcluir={(imovel) => {
                    setParaExcluir(imovel);
                    setErroDaExclusao("");
                  }}
                />
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-areia-linha bg-areia px-4 py-3">
                <p className="text-[0.82rem] text-tinta-fraca" aria-live="polite">
                  {filtrados.length === 0
                    ? "Nenhum resultado"
                    : `Mostrando ${(paginaAtual - 1) * POR_PAGINA + 1}–${Math.min(paginaAtual * POR_PAGINA, filtrados.length)} de ${filtrados.length}`}
                </p>
                <Paginacao
                  pagina={paginaAtual}
                  totalDePaginas={totalDePaginas}
                  aoTrocar={setPagina}
                />
              </div>
            </div>
          </>
        ) : null}
      </div>

      {formularioAberto ? (
        <FormularioDeImovel
          imovel={emEdicao}
          cidades={cidades}
          categorias={categorias}
          transacoes={transacoes}
          aoFechar={() => setFormularioAberto(false)}
          aoSalvar={() => {
            setFormularioAberto(false);
            void carregar();
          }}
        />
      ) : null}

      {paraExcluir ? (
        <ConfirmarExclusao
          descricao={`${paraExcluir.registro} — ${tituloDoImovel(paraExcluir)}`}
          excluindo={excluindo}
          erro={erroDaExclusao}
          aoConfirmar={confirmarExclusao}
          aoCancelar={() => setParaExcluir(null)}
        />
      ) : null}
    </>
  );
}
