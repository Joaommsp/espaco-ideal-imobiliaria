import type { Imovel, Opcao } from "@/lib/types/imovel";

/**
 * São dois endereços porque são dois pontos de vista. No navegador a API é
 * publicada em localhost; dentro do container o localhost é o próprio site,
 * então o servidor precisa chamar o serviço pelo nome na rede do Docker.
 */
const API_NAVEGADOR = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:2002";
const API_SERVIDOR = process.env.API_URL_INTERNA ?? API_NAVEGADOR;

function enderecoDaApi(): string {
  return typeof window === "undefined" ? API_SERVIDOR : API_NAVEGADOR;
}

async function buscar<T>(caminho: string): Promise<T> {
  const resposta = await fetch(`${enderecoDaApi()}${caminho}`, { cache: "no-store" });

  if (!resposta.ok) {
    throw new Error(`A API respondeu ${resposta.status} em ${caminho}.`);
  }

  return resposta.json() as Promise<T>;
}

export function listarImoveis(): Promise<Imovel[]> {
  return buscar<Imovel[]>("/properties/all");
}

export function buscarImovel(id: number | string): Promise<Imovel> {
  return buscar<Imovel>(`/properties/${id}`);
}

export async function listarCidades(): Promise<Opcao[]> {
  const cidades = await buscar<{ id: number; nomeCidade: string }[]>("/cities/all");
  return cidades.map((cidade) => ({ id: cidade.id, nome: cidade.nomeCidade }));
}

export async function listarCategorias(): Promise<Opcao[]> {
  const categorias = await buscar<{ id: number; nomeCategoria: string }[]>("/categories/all");
  return categorias.map((categoria) => ({ id: categoria.id, nome: categoria.nomeCategoria }));
}

export async function listarTransacoes(): Promise<Opcao[]> {
  const transacoes = await buscar<{ id: number; nomeTransacao: string }[]>("/transactions/all");
  return transacoes.map((transacao) => ({ id: transacao.id, nome: transacao.nomeTransacao }));
}

export interface FiltrosDeBusca {
  transacaoId: number | string;
  cityId: number | string;
  categoryId: number | string;
  qtdQuartos: number | string;
  qtdVagasGaragem: number | string;
}

/** A rota da API exige os cinco filtros na ordem — é uma busca exata. */
export function buscarImoveis(filtros: FiltrosDeBusca): Promise<Imovel[]> {
  const { transacaoId, cityId, categoryId, qtdQuartos, qtdVagasGaragem } = filtros;
  return buscar<Imovel[]>(
    `/properties/${transacaoId}/${cityId}/${categoryId}/${qtdQuartos}/${qtdVagasGaragem}`,
  );
}

export interface NovoAgendamento {
  nomeUsuario: string;
  enderecoPropriedade: string;
  propertyId: number;
  /** ISO 8601 — a API espera Date. */
  date: string;
}

/** Agenda a visita. Erro sobe para a tela mostrar o motivo, não o console. */
export async function agendarVisita(dados: NovoAgendamento): Promise<void> {
  const resposta = await fetch(`${enderecoDaApi()}/schedules`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });

  if (!resposta.ok) {
    throw new Error(
      `Não foi possível registrar a visita (a API respondeu ${resposta.status}).`,
    );
  }
}

export interface NovoUsuario {
  id: string;
  firebaseId: string;
  nome: string;
  email: string;
  senha: string;
}

/** Espelha no nosso banco o usuário que o Firebase acabou de criar. */
export async function registrarUsuario(dados: NovoUsuario): Promise<void> {
  const resposta = await fetch(`${enderecoDaApi()}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });

  if (!resposta.ok) {
    throw new Error(
      `A conta foi criada, mas não conseguimos registrá-la no sistema (${resposta.status}).`,
    );
  }
}
