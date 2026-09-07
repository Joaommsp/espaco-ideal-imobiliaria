"use client";

import { useState } from "react";
import { Botao } from "@/components/ui/Botao";
import { CampoDeTexto } from "@/components/ui/CampoDeTexto";
import { agendarVisita } from "@/lib/services/imoveis";
import {
  hoje,
  paraDataLocal,
  temProblema,
  validarAgendamento,
  type ProblemasDoAgendamento,
} from "@/lib/utils/agendamento";
import { formatarTelefone } from "@/lib/utils/telefone";

type Situacao = "parado" | "enviando" | "feito" | "erro";

const SEM_PROBLEMAS: ProblemasDoAgendamento = {};

export function AgendarVisita({ imovelId, endereco }: { imovelId: number; endereco: string }) {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [data, setData] = useState("");
  const [problemas, setProblemas] = useState<ProblemasDoAgendamento>(SEM_PROBLEMAS);
  const [situacao, setSituacao] = useState<Situacao>("parado");
  const [erro, setErro] = useState("");

  const enviando = situacao === "enviando";

  /** Corrigir o campo apaga o aviso dele, sem esperar um novo envio. */
  function aoEditar(campo: keyof ProblemasDoAgendamento) {
    setProblemas((atuais) => {
      if (!atuais[campo]) return atuais;

      const restantes = { ...atuais };
      delete restantes[campo];
      return restantes;
    });

    if (situacao === "erro") {
      setSituacao("parado");
      setErro("");
    }
  }

  async function enviar() {
    const encontrados = validarAgendamento(nome, telefone, data);

    if (temProblema(encontrados)) {
      setProblemas(encontrados);
      return;
    }

    setProblemas(SEM_PROBLEMAS);
    setSituacao("enviando");
    setErro("");

    try {
      await agendarVisita({
        nome: nome.trim(),
        telefone,
        enderecoDoImovel: endereco,
        imovelId,
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
      noValidate
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

      <div className="mt-4 flex flex-col gap-3">
        <CampoDeTexto
          rotulo="Seu nome"
          type="text"
          value={nome}
          autoComplete="name"
          placeholder="Como podemos chamar você"
          erro={problemas.nome}
          disabled={enviando}
          onChange={(evento) => {
            setNome(evento.target.value);
            aoEditar("nome");
          }}
        />

        <CampoDeTexto
          rotulo="WhatsApp (opcional)"
          type="tel"
          inputMode="numeric"
          value={telefone}
          autoComplete="tel"
          placeholder="(75) 99812-4407"
          erro={problemas.telefone}
          disabled={enviando}
          onChange={(evento) => {
            setTelefone(formatarTelefone(evento.target.value));
            aoEditar("telefone");
          }}
        />

        <CampoDeTexto
          rotulo="Dia da visita"
          type="date"
          value={data}
          min={hoje()}
          erro={problemas.data}
          disabled={enviando}
          onChange={(evento) => {
            setData(evento.target.value);
            aoEditar("data");
          }}
        />
      </div>

      <Botao type="submit" variante="grafite" className="mt-4 w-full" disabled={enviando}>
        {enviando ? "Registrando…" : "Quero visitar"}
      </Botao>

      {/* Falha do envio, não de preenchimento: essa fica no rodapé do form. */}
      {situacao === "erro" ? (
        <p role="alert" className="mt-3 animate-surgir text-sm font-medium text-laranja-escuro">
          {erro}
        </p>
      ) : null}
    </form>
  );
}
