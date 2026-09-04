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

/** Remove acento e caixa para comparar o que foi digitado com o cadastro. */
export function normalizarBusca(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

const DIAS_CURTOS = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
const MESES_CURTOS = [
  "jan", "fev", "mar", "abr", "mai", "jun",
  "jul", "ago", "set", "out", "nov", "dez",
];

export interface DataDaVisita {
  dia: string;
  mes: string;
  diaDaSemana: string;
  hora: string;
  ehHoje: boolean;
  jaPassou: boolean;
}

/** Quebra a data em partes para a agenda montar o bloco do dia. */
export function partesDaData(iso: string): DataDaVisita {
  const data = new Date(iso);
  const hoje = new Date();
  const mesmoDia =
    data.getFullYear() === hoje.getFullYear() &&
    data.getMonth() === hoje.getMonth() &&
    data.getDate() === hoje.getDate();

  return {
    dia: String(data.getDate()).padStart(2, "0"),
    mes: MESES_CURTOS[data.getMonth()] ?? "",
    diaDaSemana: DIAS_CURTOS[data.getDay()] ?? "",
    hora: data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    ehHoje: mesmoDia,
    jaPassou: !mesmoDia && data.getTime() < hoje.getTime(),
  };
}
