"use client";

import { IconSearch, IconUsersGroup } from "@tabler/icons-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Metricas, TopoDaPagina } from "@/components/painel/TopoDaPagina";
import { Botao } from "@/components/ui/Botao";
import { CarregandoPagina } from "@/components/ui/Carregando";
import { listarUsuarios, type Usuario } from "@/lib/services/api";
import { normalizarBusca } from "@/lib/utils/formatters";

type Situacao = "carregando" | "pronto" | "erro";

const SEM_USUARIOS: Usuario[] = [];

/** Duas primeiras letras do nome, para o avatar sem foto. */
function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/);
  const primeira = partes[0]?.[0] ?? "?";
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
  return (primeira + ultima).toUpperCase();
}

export default function PaginaDeUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>(SEM_USUARIOS);
  const [situacao, setSituacao] = useState<Situacao>("carregando");
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");

  const carregar = useCallback(async () => {
    setSituacao("carregando");

    try {
      setUsuarios(await listarUsuarios());
      setSituacao("pronto");
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : "Erro ao carregar os usuários.");
      setSituacao("erro");
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const visiveis = useMemo(() => {
    const termo = normalizarBusca(busca);
    if (!termo) {
      return usuarios;
    }

    return usuarios.filter((usuario) =>
      [usuario.nome, usuario.email].some((campo) => normalizarBusca(campo).includes(termo)),
    );
  }, [usuarios, busca]);

  return (
    <>
      <TopoDaPagina
        titulo="Usuários"
        resumo={
          situacao === "pronto"
            ? `${usuarios.length} ${usuarios.length === 1 ? "conta criada" : "contas criadas"} pelo site`
            : "Carregando os usuários…"
        }
      />

      <div className="px-6 py-5">
        {situacao === "carregando" ? <CarregandoPagina rotulo="Carregando os usuários" /> : null}

        {situacao === "erro" ? (
          <div role="alert" className="rounded-cartao border border-laranja/30 bg-laranja-fraco px-6 py-10 text-center">
            <h2 className="font-display text-xl">Não conseguimos carregar os usuários</h2>
            <p className="mx-auto mt-2 max-w-[52ch] text-sm text-tinta-suave">{erro}</p>
            <Botao className="mt-5" onClick={carregar}>
              Tentar novamente
            </Botao>
          </div>
        ) : null}

        {situacao === "pronto" ? (
          <>
            <Metricas
              itens={[
                { valor: String(usuarios.length), rotulo: "contas no sistema" },
                {
                  valor: String(new Set(usuarios.map((u) => u.email.split("@")[1])).size),
                  rotulo: "domínios de e-mail",
                },
              ]}
            />

            <div className="relative mb-4 max-w-md">
              <IconSearch
                size={15}
                stroke={1.8}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-tinta-fraca"
              />
              <input
                value={busca}
                onChange={(evento) => setBusca(evento.target.value)}
                placeholder="Buscar por nome ou e-mail"
                aria-label="Buscar usuários"
                className="w-full rounded-[9px] border-0 bg-white py-2.5 pl-9 pr-3 text-[0.9rem] shadow-[0_0_0_1px_rgba(15,19,23,0.1)] outline-none focus:shadow-[0_0_0_3px_rgba(10,132,255,0.35),0_0_0_1px_#0A84FF]"
              />
            </div>

            {visiveis.length === 0 ? (
              <div className="rounded-[12px] border border-dashed border-areia-linha bg-white px-6 py-14 text-center">
                <span className="mx-auto grid size-12 place-items-center rounded-full bg-areia-escura text-tinta-fraca">
                  <IconUsersGroup size={22} stroke={1.6} />
                </span>
                <h2 className="mt-4 font-display text-xl">
                  {usuarios.length === 0 ? "Nenhuma conta criada ainda" : "Nenhum usuário encontrado"}
                </h2>
                <p className="mx-auto mt-2 max-w-[46ch] text-sm text-tinta-suave">
                  {usuarios.length === 0
                    ? "As contas criadas pelo site aparecem aqui, com nome e e-mail."
                    : "Tente outro termo de busca."}
                </p>
              </div>
            ) : (
              <ul className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {visiveis.map((usuario) => (
                  <li
                    key={usuario.id}
                    className="flex items-center gap-3 rounded-[11px] border border-areia-linha bg-white px-4 py-3.5"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-grafite text-[0.78rem] font-bold text-white">
                      {iniciais(usuario.nome)}
                    </span>
                    <span className="min-w-0">
                      <b className="block truncate text-[0.92rem]">{usuario.nome}</b>
                      <small className="block truncate text-[0.8rem] text-tinta-fraca">
                        {usuario.email}
                      </small>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : null}
      </div>
    </>
  );
}
