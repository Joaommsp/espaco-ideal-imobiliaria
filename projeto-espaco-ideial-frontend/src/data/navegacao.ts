import {
  IconBuildingEstate,
  IconMapPin,
  IconMessage,
  IconRoute,
} from "@tabler/icons-react";
import type { ElementType } from "react";

/**
 * As seções do site em um lugar só. O cabeçalho as mostra em linha a partir do
 * desktop; no celular quem as apresenta é o menu lateral. Duas listas
 * separadas divergiriam no primeiro link novo.
 */
export interface Secao {
  rotulo: string;
  href: string;
  icone: ElementType;
}

export const SECOES: Secao[] = [
  { rotulo: "Imóveis", href: "/properties", icone: IconBuildingEstate },
  { rotulo: "Cidades", href: "/#cidades", icone: IconMapPin },
  { rotulo: "Como funciona", href: "/#como-funciona", icone: IconRoute },
  { rotulo: "Contato", href: "/#contato", icone: IconMessage },
];
