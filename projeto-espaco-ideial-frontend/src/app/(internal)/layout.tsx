"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ReactNode, useState } from "react";
import {
  IconBuildingEstate,
  IconMapPin,
  IconMenuDeep,
  IconMessage,
  IconProgressX,
  IconRoute,
} from "@tabler/icons-react";
import type { ElementType } from "react";
import { Cabecalho } from "@/components/landing/Cabecalho";
import { BotaoLink } from "@/components/ui/Botao";
import { CONTATO } from "@/data/contato";
import { SECOES } from "@/data/navegacao";
import { MICRO_ROTULO } from "@/lib/utils/estilos";

/**
 * O ícone é escolha de apresentação, e este é o único lugar que os mostra —
 * o cabeçalho lista as mesmas seções só com texto. Por isso o mapa vive aqui,
 * e não em `data/navegacao.ts`, que é dado puro.
 */
const ICONE_DA_SECAO: Record<string, ElementType> = {
  "/properties": IconBuildingEstate,
  "/#cidades": IconMapPin,
  "/#como-funciona": IconRoute,
  "/#contato": IconMessage,
};

export interface LayoutInternoProps {
  children: ReactNode;
}

/**
 * O cabeçalho mostra as seções em linha a partir do desktop. Abaixo disso não
 * cabem, e é este painel que as apresenta — por isso o botão do menu só existe
 * no celular.
 */
export default function LayoutInterno({ children }: LayoutInternoProps) {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <div className="relative overflow-hidden">
      <Cabecalho
        tom="claro"
        acaoExtra={
          <button
            onClick={() => setMenuAberto(true)}
            aria-label="Abrir o menu"
            aria-expanded={menuAberto}
            className="grid size-10 place-items-center rounded-full text-tinta transition-colors hover:bg-areia-escura md:hidden"
          >
            <IconMenuDeep size={22} />
          </button>
        }
      />

      <AnimatePresence>
        {menuAberto && (
          <>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuAberto(false)}
              aria-label="Fechar o menu"
              className="fixed inset-0 z-40 bg-grafite/40 md:hidden"
            />

            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 z-50 flex h-full w-72 flex-col bg-white p-5 shadow-flutuante md:hidden"
            >
              <div className="mb-7 flex items-center justify-between">
                <span className={MICRO_ROTULO}>Navegar</span>
                <button
                  onClick={() => setMenuAberto(false)}
                  aria-label="Fechar o menu"
                  className="grid size-9 place-items-center rounded-full text-tinta transition-colors hover:bg-areia-escura"
                >
                  <IconProgressX size={22} />
                </button>
              </div>

              <ul className="flex flex-col gap-1">
                {SECOES.map((secao) => {
                  const Icone = ICONE_DA_SECAO[secao.href];

                  return (
                  <li key={secao.href}>
                    <Link
                      href={secao.href}
                      onClick={() => setMenuAberto(false)}
                      className="flex items-center gap-3 rounded-lg p-2.5 text-tinta transition-colors hover:bg-areia-escura"
                    >
                      {Icone ? <Icone size={21} className="text-tinta-fraca" /> : null}
                      <span>{secao.rotulo}</span>
                    </Link>
                  </li>
                  );
                })}
              </ul>

              <BotaoLink
                href={CONTATO.whatsapp}
                externo
                variante="laranja"
                className="mt-auto w-full"
              >
                Falar no WhatsApp
              </BotaoLink>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main>{children}</main>
    </div>
  );
}
