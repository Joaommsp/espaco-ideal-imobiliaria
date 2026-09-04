"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import {
  IconBuildingCommunity,
  IconCalendarEvent,
  IconCategory,
  IconHome2,
  IconLogout,
  IconMapPin,
  IconUsers,
} from "@tabler/icons-react";
import { adminAuth } from "@/lib/services/firebase-admin-service";

export interface ContagemDaLateral {
  imoveis?: number;
  agendamentos?: number;
  usuarios?: number;
  cidades?: number;
  categorias?: number;
}

const GRUPOS = [
  {
    titulo: "Cadastros",
    itens: [
      { rotulo: "Imóveis", href: "/dashboard/properties", icone: IconHome2, chave: "imoveis" },
      {
        rotulo: "Agendamentos",
        href: "/dashboard/schedules",
        icone: IconCalendarEvent,
        chave: "agendamentos",
      },
      { rotulo: "Usuários", href: "/dashboard/users", icone: IconUsers, chave: "usuarios" },
    ],
  },
  {
    titulo: "Catálogo",
    itens: [
      { rotulo: "Cidades", href: "/dashboard/cities", icone: IconMapPin, chave: "cidades" },
      {
        rotulo: "Categorias",
        href: "/dashboard/categories",
        icone: IconCategory,
        chave: "categorias",
      },
    ],
  },
] as const;

/** Navegação fixa: o menu escondido atrás do ícone desperdiçava a tela larga. */
export function Lateral({
  contagem = {},
  email,
}: {
  contagem?: ContagemDaLateral;
  email?: string | null;
}) {
  const rota = usePathname();
  const router = useRouter();

  async function sair() {
    await signOut(adminAuth);
    router.push("/dashboard/login");
  }

  const iniciais = (email ?? "AD").slice(0, 2).toUpperCase();

  return (
    <aside className="hidden w-[232px] shrink-0 flex-col gap-6 bg-grafite p-4 text-white/75 lg:flex">
      <Link href="/dashboard/home" className="flex items-center gap-2.5 px-2 pt-1">
        <IconBuildingCommunity size={22} className="shrink-0 text-laranja" stroke={1.8} />
        <span>
          <b className="block font-display text-base text-white">Espaço Ideal</b>
          <small className="block text-[0.6rem] uppercase tracking-[0.12em] text-white/40">
            Administração
          </small>
        </span>
      </Link>

      {GRUPOS.map((grupo) => (
        <nav key={grupo.titulo} aria-label={grupo.titulo} className="grid gap-0.5">
          <span className="px-2.5 pb-1 pt-2 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-white/35">
            {grupo.titulo}
          </span>
          {grupo.itens.map((item) => {
            const ativo = rota.startsWith(item.href);
            const Icone = item.icone;
            const total = contagem[item.chave as keyof ContagemDaLateral];

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={ativo ? "page" : undefined}
                className={[
                  "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[0.9rem] transition-colors",
                  ativo ? "bg-laranja text-white" : "hover:bg-white/[0.07] hover:text-white",
                ].join(" ")}
              >
                <Icone size={18} stroke={1.8} className="shrink-0" />
                {item.rotulo}
                {typeof total === "number" ? (
                  <span className={["ml-auto text-[0.75rem]", ativo ? "text-white/90" : "text-white/45"].join(" ")}>
                    {total}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
      ))}

      <div className="mt-auto border-t border-white/10 pt-3">
        <div className="flex items-center gap-2.5 px-2.5 py-2">
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-grafite-suave text-[0.7rem] font-bold text-white">
            {iniciais}
          </span>
          <span className="min-w-0">
            <b className="block text-[0.82rem] font-semibold text-white">Administrador</b>
            <small className="block truncate text-[0.7rem] text-white/40">{email ?? "—"}</small>
          </span>
        </div>
        <button
          type="button"
          onClick={sair}
          className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[0.9rem] transition-colors hover:bg-white/[0.07] hover:text-white"
        >
          <IconLogout size={18} stroke={1.8} className="shrink-0" />
          Sair
        </button>
      </div>
    </aside>
  );
}
