/**
 * As fotos dos imóveis vivem no site, não no painel: o cadastro guarda um
 * caminho relativo como "/imoveis/EI-1009.webp", que aqui precisa virar
 * endereço absoluto para carregar.
 */
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:2000";

export function urlDaFoto(url: string | undefined): string {
  if (!url) {
    return "";
  }

  return url.startsWith("/") ? `${SITE}${url}` : url;
}
