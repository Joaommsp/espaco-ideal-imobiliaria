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
 * Cópia antes de entregar. Reordenar nunca foi o risco — `.map()` já devolve
 * array novo. O risco é a tela mutar um imóvel: sem isto ela estaria editando
 * o objeto do módulo, e a alteração apareceria em todas as outras páginas.
 *
 * As relações vão junto, senão a proteção pararia no primeiro nível.
 */
function copiar(imovel: Imovel): Imovel {
  return {
    ...imovel,
    city: imovel.city && { ...imovel.city },
    category: imovel.category && { ...imovel.category },
    transacao: imovel.transacao && { ...imovel.transacao },
  };
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

/**
 * Este contrato é interno e divergiu do backend de propósito — antes ele
 * espelhava o corpo do POST. Quem for religar a API precisa saber que o
 * `CreateScheduleDto` do NestJS espera `nomeUsuario`, `enderecoPropriedade`,
 * `propertyId` e `date`, e que **o `model Schedule` não tem coluna de
 * telefone**: o campo abaixo exige migration, não só renomear.
 */
export interface NovoAgendamento {
  nome: string;
  telefone: string;
  enderecoDoImovel: string;
  imovelId: number;
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
