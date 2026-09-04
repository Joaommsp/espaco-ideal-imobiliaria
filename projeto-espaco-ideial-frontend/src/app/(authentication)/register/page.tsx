"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MolduraDeAutenticacao } from "@/components/autenticacao/MolduraDeAutenticacao";
import { Botao } from "@/components/ui/Botao";
import { Carregando } from "@/components/ui/Carregando";
import { CampoDeSenha, CampoDeTexto } from "@/components/ui/CampoDeTexto";
import { registrarUsuario } from "@/lib/services/imoveis";

type Situacao = "parado" | "criando" | "criada";

const MINIMO_DA_SENHA = 6;

interface Erros {
  nome?: string;
  email?: string;
  senha?: string;
  envio?: string;
}

export default function Register() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [situacao, setSituacao] = useState<Situacao>("parado");
  const [erros, setErros] = useState<Erros>({});

  function validar(): Erros {
    const encontrados: Erros = {};

    if (!nome.trim()) {
      encontrados.nome = "Como podemos te chamar?";
    }
    if (!email.trim()) {
      encontrados.email = "Informe seu e-mail.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      encontrados.email = "Esse e-mail não parece completo.";
    }
    if (senha.length < MINIMO_DA_SENHA) {
      encontrados.senha = `A senha precisa de pelo menos ${MINIMO_DA_SENHA} caracteres.`;
    }

    return encontrados;
  }

  async function criarConta() {
    const encontrados = validar();
    setErros(encontrados);

    if (Object.keys(encontrados).length > 0) {
      return;
    }

    setSituacao("criando");

    try {
      // A rota interna cria no Firebase; depois espelhamos no nosso banco.
      const resposta = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: nome.trim(),
          userEmail: email.trim(),
          userPassword: senha,
        }),
      });

      const resultado = await resposta.json();

      if (!resultado.success) {
        throw new Error(resultado.error || "Não foi possível criar a conta.");
      }

      await registrarUsuario({
        id: resultado.id,
        firebaseId: resultado.firebaseId,
        nome: resultado.name,
        email: resultado.email,
        senha: resultado.password,
      });

      setSituacao("criada");
      router.push("/login");
    } catch (falha) {
      setErros({
        envio: falha instanceof Error ? falha.message : "Ocorreu um erro ao criar a conta.",
      });
      setSituacao("parado");
    }
  }

  return (
    <MolduraDeAutenticacao
      titulo="Criar sua conta"
      apoio="Leva menos de um minuto e não custa nada."
      rodape={
        <>
          Já tem conta?{" "}
          <Link href="/login" className="font-semibold text-laranja hover:underline">
            Entrar
          </Link>
        </>
      }
    >
      <form
        className="flex flex-col gap-4"
        noValidate
        onSubmit={(evento) => {
          evento.preventDefault();
          void criarConta();
        }}
      >
        <CampoDeTexto
          rotulo="Nome"
          autoComplete="name"
          placeholder="Seu nome"
          value={nome}
          erro={erros.nome}
          disabled={situacao !== "parado"}
          onChange={(evento) => {
            setNome(evento.target.value);
            setErros((atuais) => ({ ...atuais, nome: undefined }));
          }}
        />

        <CampoDeTexto
          rotulo="E-mail"
          type="email"
          autoComplete="email"
          placeholder="voce@email.com"
          value={email}
          erro={erros.email}
          disabled={situacao !== "parado"}
          onChange={(evento) => {
            setEmail(evento.target.value);
            setErros((atuais) => ({ ...atuais, email: undefined }));
          }}
        />

        <CampoDeSenha
          rotulo="Senha"
          autoComplete="new-password"
          placeholder="Crie uma senha"
          value={senha}
          erro={erros.senha}
          dica={`Pelo menos ${MINIMO_DA_SENHA} caracteres.`}
          disabled={situacao !== "parado"}
          onChange={(evento) => {
            setSenha(evento.target.value);
            setErros((atuais) => ({ ...atuais, senha: undefined }));
          }}
        />

        <Botao
          type="submit"
          tamanho="grande"
          className="mt-1 w-full rounded-[9px]"
          disabled={situacao !== "parado"}
        >
          {situacao === "criando" ? <Carregando rotulo="Criando a conta" /> : "Criar conta"}
        </Botao>

        {erros.envio ? (
          <p role="alert" className="animate-surgir text-sm font-medium text-laranja-escuro">
            {erros.envio}
          </p>
        ) : null}

        {situacao === "criada" ? (
          <p role="status" className="animate-surgir text-sm font-medium text-verde">
            Conta criada. Entrando…
          </p>
        ) : null}
      </form>
    </MolduraDeAutenticacao>
  );
}
