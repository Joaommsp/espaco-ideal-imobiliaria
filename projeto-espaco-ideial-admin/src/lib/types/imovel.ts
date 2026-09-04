/** Formato que a API devolve em /properties — as relações vêm incluídas. */
export interface Imovel {
  id: number;
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
  city?: { id: number; nomeCidade: string };
  category?: { id: number; nomeCategoria: string };
  transacao?: { id: number; nomeTransacao: string };
}

export interface Opcao {
  id: number;
  nome: string;
}
