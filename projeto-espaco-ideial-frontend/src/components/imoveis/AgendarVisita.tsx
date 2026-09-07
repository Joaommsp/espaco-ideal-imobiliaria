"use client";

import { useState } from "react";
import { Botao } from "@/components/ui/Botao";
import { agendarVisita } from "@/lib/services/imoveis";
import { formatarTelefone, telefoneValido } from "@/lib/utils/telefone";

type Situacao = "parado" | "enviando" | "feito" | "erro";

/**
 * Data mínima é hoje — em horário local. Com toISOString() o valor vira UTC:
 * depois das 21h em Brasília o "hoje" já virava amanhã e a pessoa não
 * conseguia marcar para o próprio dia.
 */
function hoje(): string {
  const agora = new Date();
  return [
    agora.getFullYear(),
    String(agora.getMonth() + 1).padStart(2, "0"),
    String(agora.getDate()).padStart(2, "0"),
  ].join("-");
}

/**
 * O <input type="date"> devolve "2026-09-10", que o construtor Date lê como
 * meia-noite UTC — em Brasília isso é dia 9 às 21h, e era esse dia que ia
 * parar no registro. Montando em horário local, a data é a escolhida.
 */
function paraDataLocal(valor: string): Date {
  const [ano, mes, dia] = valor.split("-").map(Number);
  return new Date(ano, mes - 1, dia, 12, 0, 0);
}

/**
 * Sem conta de usuário, o nome precisa vir do próprio formulário — antes ele
 * saía da sessão. O telefone é opcional: quem prefere ser chamado por e-mail
 * não deveria travar no campo.
 */
export function primeiroProblema(
  nome: string,
  telefone: string,
  data: string,
): string | null {
  if (!nome.trim()) return "Diga seu nome para o corretor saber quem procurar.";
  if (!data) return "Escolha o dia da visita.";
  if (telefone && !telefoneValido(telefone)) {
    return "O WhatsApp precisa ter DDD e número completo.";
  }
  return null;
}

export function AgendarVisita({ imovelId, endereco }: { imovelId: number; endereco: string }) {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [data, setData] = useState("");
  const [situacao, setSituacao] = useState<Situacao>("parado");
  const [erro, setErro] = useState("");

  const enviando = situacao === "enviando";

  function aoEditar() {
    if (situacao === "erro") {
      setSituacao("parado");
      setErro("");
    }
  }

  async function enviar() {
    const problema = primeiroProblema(nome, telefone, data);

    if (problema) {
      setErro(problema);
      setSituacao("erro");
      return;
    }

    setSituacao("enviando");
    setErro("");

    try {
      await agendarVisita({
        nome: nome.trim(),
        telefone,
        enderecoPropriedade: endereco,
        propertyId: imovelId,
        data: paraDataLocal(data).toISOString(),
      });
      setSituacao("feito");
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : "Erro ao registrar a visita.");
      setSituacao("erro");
    }
  }

  if (situacao === "feito") {
    return (
      <div role="status" className="animate-surgir rounded-cartao bg-verde/10 p-5 text-center">
        <p className="font-display text-lg text-verde">Visita registrada</p>
        <p className="mt-1.5 text-sm text-tinta-suave">
          Um corretor entra em contato para confirmar o horário.
        </p>
        <Botao
          variante="contorno"
          tamanho="compacto"
          className="mt-4"
          onClick={() => {
            setSituacao("parado");
            setData("");
          }}
        >
          Agendar outra data
        </Botao>
      </div>
    );
  }

  return (
    <form
      className="rounded-cartao border border-areia-linha bg-white p-5"
      onSubmit={(evento) => {
        evento.preventDefault();
        void enviar();
      }}
    >
      <h2 className="font-display text-lg">Agendar uma visita</h2>
      <p className="mt-1 text-sm text-tinta-suave">
        Escolha o dia e um corretor da praça acompanha você no imóvel.
      </p>

      <label className="mt-4 block">
        <span className={ROTULO}>Seu nome</span>
        <input
          type="text"
          value={nome}
          autoComplete="name"
          placeholder="Como podemos chamar você"
          onChange={(evento) => {
            setNome(evento.target.value);
            aoEditar();
          }}
          disabled={enviando}
          className={CAMPO}
        />
      </label>

      <label className="mt-3 block">
        <span className={ROTULO}>WhatsApp (opcional)</span>
        <input
          type="tel"
          inputMode="numeric"
          value={telefone}
          autoComplete="tel"
          placeholder="(75) 99812-4407"
          onChange={(evento) => {
            setTelefone(formatarTelefone(evento.target.value));
            aoEditar();
          }}
          disabled={enviando}
          className={CAMPO}
        />
      </label>

      <label className="mt-3 block">
        <span className={ROTULO}>Dia da visita</span>
        <input
          type="date"
          value={data}
          min={hoje()}
          onChange={(evento) => {
            setData(evento.target.value);
            aoEditar();
          }}
          disabled={enviando}
          className={CAMPO}
        />
      </label>

      <Botao type="submit" variante="grafite" className="mt-4 w-full" disabled={enviando}>
        {enviando ? "Registrando…" : "Quero visitar"}
      </Botao>

      {situacao === "erro" ? (
        <p role="alert" className="mt-3 animate-surgir text-sm font-medium text-laranja-escuro">
          {erro}
        </p>
      ) : null}
    </form>
  );
}

const ROTULO = "text-[0.7rem] font-bold uppercase tracking-[0.1em] text-tinta-fraca";

const CAMPO =
  "mt-1 w-full rounded-lg border border-areia-linha bg-areia px-3 py-2.5 text-tinta outline-none transition-colors placeholder:text-tinta-fraca focus:border-laranja disabled:opacity-60";
