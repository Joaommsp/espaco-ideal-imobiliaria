import type { Imovel, Opcao } from "@/lib/types/imovel";

/**
 * São dois endereços porque são dois pontos de vista: no navegador a API é
 * publicada em localhost; dentro do container o localhost é o próprio painel.
 */
const API_NAVEGADOR = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:2002";
const API_SERVIDOR = process.env.API_URL_INTERNA ?? API_NAVEGADOR;

function enderecoDaApi(): string {
  return typeof window === "undefined" ? API_SERVIDOR : API_NAVEGADOR;
}

async function pedir<T>(caminho: string, opcoes?: RequestInit): Promise<T> {
  const resposta = await fetch(`${enderecoDaApi()}${caminho}`, {
    cache: "no-store",
    ...opcoes,
    headers: { "Content-Type": "application/json", ...opcoes?.headers },
  });

  if (!resposta.ok) {
    throw new Error(`A API respondeu ${resposta.status} em ${caminho}.`);
  }

  // DELETE costuma voltar sem corpo.
  const texto = await resposta.text();
  return (texto ? JSON.parse(texto) : null) as T;
}

export interface Agendamento {
  id: number;
  userName: string;
  propertyId: number;
  propertyAdress: string;
  date: string;
}

export interface Usuario {
  id: string;
  firebaseId: string;
  nome: string;
  email: string;
}

export const listarImoveis = () => pedir<Imovel[]>("/properties/all");
export const buscarImovel = (id: number) => pedir<Imovel>(`/properties/${id}`);
export const listarAgendamentos = () => pedir<Agendamento[]>("/schedules/all");
export const listarUsuarios = () => pedir<Usuario[]>("/users/all");

export async function listarCidades(): Promise<Opcao[]> {
  const cidades = await pedir<{ id: number; nomeCidade: string }[]>("/cities/all");
  return cidades.map((cidade) => ({ id: cidade.id, nome: cidade.nomeCidade }));
}

export async function listarCategorias(): Promise<Opcao[]> {
  const categorias = await pedir<{ id: number; nomeCategoria: string }[]>("/categories/all");
  return categorias.map((c) => ({ id: c.id, nome: c.nomeCategoria }));
}

export async function listarTransacoes(): Promise<Opcao[]> {
  const transacoes = await pedir<{ id: number; nomeTransacao: string }[]>("/transactions/all");
  return transacoes.map((t) => ({ id: t.id, nome: t.nomeTransacao }));
}

export interface DadosDoImovel {
  registro: string;
  endereco: string;
  descricao: string;
  qtdQuartos: number;
  qtdVagasGaragem: number;
  area: number;
  preco: number;
  urlImagem: string;
  cityId: number;
  categoryId: number;
  transacaoId: number;
}

export const criarImovel = (dados: DadosDoImovel) =>
  pedir<Imovel>("/properties", { method: "POST", body: JSON.stringify(dados) });

export const atualizarImovel = (id: number, dados: Partial<DadosDoImovel>) =>
  pedir<Imovel>(`/properties/${id}`, { method: "PATCH", body: JSON.stringify(dados) });

export const excluirImovel = (id: number) =>
  pedir<null>(`/properties/${id}`, { method: "DELETE" });

export const excluirAgendamento = (id: number) =>
  pedir<null>(`/schedules/${id}`, { method: "DELETE" });
