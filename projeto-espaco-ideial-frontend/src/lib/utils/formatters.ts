/**
 * Preço sempre em real por extenso: R$ 420.000,00 — nunca o número cru do
 * banco. Imobiliária vende pelo preço; ele precisa ser lido de imediato.
 */
export function formatarBRL(valor: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor ?? 0);
}

/** Nome da transação que representa aluguel, como está cadastrado no banco. */
const TRANSACAO_LOCACAO = "locação";

/**
 * Aluguel e venda no mesmo formato confundem: R$ 1.800,00 de aluguel parece
 * imóvel barato à venda. O sufixo "/mês" desfaz a ambiguidade.
 */
export function formatarPreco(valor: number, nomeTransacao?: string): string {
  const preco = formatarBRL(valor);
  const ehLocacao = nomeTransacao?.trim().toLowerCase() === TRANSACAO_LOCACAO;

  return ehLocacao ? `${preco}/mês` : preco;
}

/** Área em metros quadrados, sem casas decimais desnecessárias. */
export function formatarArea(area: number): string {
  return `${new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 }).format(area ?? 0)} m²`;
}
