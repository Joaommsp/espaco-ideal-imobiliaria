import type { Imovel } from "@/lib/types/imovel";

/**
 * Título do card: a pessoa procura por tipo de imóvel, não pelo código de
 * cadastro. O registro fica reservado para a página de detalhe.
 */
export function tituloDoImovel(imovel: Imovel): string {
  const tipo = imovel.category?.nomeCategoria;
  const primeiraFrase = imovel.descricao?.split(/[.,]/)[0]?.trim();

  if (primeiraFrase && primeiraFrase.length <= 46) {
    return primeiraFrase;
  }

  return tipo ? `${tipo} em ${imovel.city?.nomeCidade ?? "localização a confirmar"}` : imovel.registro;
}

/**
 * Bairro e cidade em vez do endereço completo: o endereço inteiro não cabe no
 * card e acaba truncado no meio de uma palavra.
 */
export function localDoImovel(imovel: Imovel): string {
  const partes = imovel.endereco?.split("—").map((parte) => parte.trim()) ?? [];
  const bairroECidade = partes.length > 1 ? partes[partes.length - 1] : null;

  return bairroECidade ?? imovel.city?.nomeCidade ?? "Local a confirmar";
}

export function ehLocacao(imovel: Imovel): boolean {
  return imovel.transacao?.nomeTransacao?.trim().toLowerCase() === "locação";
}
