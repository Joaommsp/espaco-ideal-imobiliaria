import { CATEGORIAS, CIDADES, IMOVEIS, TRANSACOES } from "@/lib/mocks/catalogo";
import type { Imovel, Opcao } from "@/lib/types/imovel";

/**
 * Esta é a versão de exibição do site: o catálogo mora no bundle, não em uma
 * API. As funções abaixo mantêm a assinatura que as telas já usavam quando
 * havia backend — por isso nenhuma página precisou mudar.
 *
 * Elas continuam assíncronas de propósito. Buscar dado é assíncrono no mundo
 * real, e responder de forma síncrona apagaria os estados de carregamento que
 * este site foi desenhado para ter.
 */

/** Curto o bastante para não irritar, longo o bastante para o esqueleto aparecer. */
const ATRASO_DA_REDE_MS = 260;

function responder<T>(dados: T): Promise<T> {
  return new Promise((resolver) => {
    setTimeout(() => resolver(dados), ATRASO_DA_REDE_MS);
  });
}

/**
 * Cópia antes de entregar: as telas guardam a lista em estado e ordenam em
 * cima dela. Sem isto, um `sort` numa página reordenaria o catálogo para todas
 * as outras, porque é o mesmo array do módulo.
 */
function copiar(imovel: Imovel): Imovel {
  return { ...imovel };
}

export function listarImoveis(): Promise<Imovel[]> {
  return responder(IMOVEIS.map(copiar));
}

export function buscarImovel(id: number | string): Promise<Imovel> {
  const procurado = Number(id);
  const encontrado = Number.isInteger(procurado)
    ? IMOVEIS.find((imovel) => imovel.id === procurado)
    : undefined;

  if (!encontrado) {
    // Rejeitar em vez de devolver nada: a tela já tem um aviso de erro pronto,
    // e ele precisa de um motivo para mostrar.
    return Promise.reject(new Error(`Não encontramos o imóvel ${id} no catálogo.`));
  }

  return responder(copiar(encontrado));
}

export function listarCidades(): Promise<Opcao[]> {
  return responder(CIDADES.map((cidade) => ({ ...cidade })));
}

export function listarCategorias(): Promise<Opcao[]> {
  return responder(CATEGORIAS.map((categoria) => ({ ...categoria })));
}

export function listarTransacoes(): Promise<Opcao[]> {
  return responder(TRANSACOES.map((transacao) => ({ ...transacao })));
}

export interface FiltrosDeBusca {
  transacaoId: number | string;
  cityId: number | string;
  categoryId: number | string;
  qtdQuartos: number | string;
  qtdVagasGaragem: number | string;
}

/** Os cinco filtros valem por igualdade exata — é uma busca exata, não uma faixa. */
export function buscarImoveis(filtros: FiltrosDeBusca): Promise<Imovel[]> {
  const resultado = IMOVEIS.filter(
    (imovel) =>
      imovel.transacaoId === Number(filtros.transacaoId) &&
      imovel.cityId === Number(filtros.cityId) &&
      imovel.categoryId === Number(filtros.categoryId) &&
      imovel.qtdQuartos === Number(filtros.qtdQuartos) &&
      imovel.qtdVagasGaragem === Number(filtros.qtdVagasGaragem),
  );

  // Nenhum resultado é uma resposta, não uma falha: a tela tem estado vazio.
  return responder(resultado.map(copiar));
}

export interface NovoAgendamento {
  nome: string;
  telefone: string;
  enderecoPropriedade: string;
  propertyId: number;
  /** ISO 8601 — a data escolhida, montada em horário local. */
  data: string;
}

/**
 * Sem servidor não há onde gravar a visita. A função existe para que o
 * formulário mantenha o fluxo inteiro — carregando, sucesso, erro — em vez de
 * fingir que salvou no mesmo instante do clique.
 */
export function agendarVisita(dados: NovoAgendamento): Promise<NovoAgendamento> {
  return responder(dados);
}
