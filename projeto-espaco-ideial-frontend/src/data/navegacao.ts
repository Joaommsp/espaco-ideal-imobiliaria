/**
 * As seções do site em um lugar só. O cabeçalho as mostra em linha a partir do
 * desktop; no celular quem as apresenta é o menu lateral. Duas listas
 * separadas divergiriam no primeiro link novo.
 *
 * Dado puro, como o resto de `data/`: o ícone de cada seção é escolha de
 * apresentação e mora em quem desenha o menu.
 */
export interface Secao {
  rotulo: string;
  href: string;
}

export const SECOES: Secao[] = [
  { rotulo: "Imóveis", href: "/properties" },
  { rotulo: "Cidades", href: "/#cidades" },
  { rotulo: "Como funciona", href: "/#como-funciona" },
  { rotulo: "Contato", href: "/#contato" },
];
