"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * O App Router preserva a posição da rolagem em algumas transições — a pessoa
 * abre um imóvel e cai no meio da página. Toda troca de rota volta ao topo.
 */
export function RolarParaOTopo() {
  const rota = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [rota]);

  return null;
}
