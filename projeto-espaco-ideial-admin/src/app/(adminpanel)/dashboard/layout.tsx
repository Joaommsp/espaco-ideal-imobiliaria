"use client";

import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Lateral, type ContagemDaLateral } from "@/components/painel/Lateral";
import { CarregandoPagina } from "@/components/ui/Carregando";
import {
  listarAgendamentos,
  listarCategorias,
  listarCidades,
  listarImoveis,
  listarUsuarios,
} from "@/lib/services/api";
import { adminAuth } from "@/lib/services/firebase-admin-service";

const SEM_CONTAGEM: ContagemDaLateral = {};

/**
 * Moldura do painel: lateral fixa e área de conteúdo. O login fica fora dela,
 * por isso a rota é verificada antes de exigir sessão.
 */
export default function LayoutDoPainel({ children }: { children: React.ReactNode }) {
  const rota = usePathname();
  const router = useRouter();
  const ehLogin = rota.startsWith("/dashboard/login");

  const [verificando, setVerificando] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [contagem, setContagem] = useState<ContagemDaLateral>(SEM_CONTAGEM);

  useEffect(() => {
    const cancelar = onAuthStateChanged(adminAuth, (usuario) => {
      setEmail(usuario?.email ?? null);
      setVerificando(false);

      if (!usuario && !ehLogin) {
        router.push("/dashboard/login");
      }
    });

    return () => cancelar();
  }, [ehLogin, router]);

  // A contagem da lateral é informativa: se falhar, a navegação continua.
  useEffect(() => {
    if (ehLogin) {
      return;
    }

    Promise.allSettled([
      listarImoveis(),
      listarAgendamentos(),
      listarUsuarios(),
      listarCidades(),
      listarCategorias(),
    ]).then(([imoveis, agendamentos, usuarios, cidades, categorias]) => {
      setContagem({
        imoveis: imoveis.status === "fulfilled" ? imoveis.value.length : undefined,
        agendamentos: agendamentos.status === "fulfilled" ? agendamentos.value.length : undefined,
        usuarios: usuarios.status === "fulfilled" ? usuarios.value.length : undefined,
        cidades: cidades.status === "fulfilled" ? cidades.value.length : undefined,
        categorias: categorias.status === "fulfilled" ? categorias.value.length : undefined,
      });
    });
  }, [ehLogin, rota]);

  if (ehLogin) {
    return <>{children}</>;
  }

  if (verificando) {
    return <CarregandoPagina rotulo="Verificando o acesso" />;
  }

  return (
    <div className="flex min-h-dvh">
      <Lateral contagem={contagem} email={email} />
      <div className="min-w-0 flex-1 bg-areia">{children}</div>
    </div>
  );
}
