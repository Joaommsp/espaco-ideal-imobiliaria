"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { MolduraDeAutenticacao } from "@/components/autenticacao/MolduraDeAutenticacao";
import { Botao } from "@/components/ui/Botao";
import { Carregando } from "@/components/ui/Carregando";
import { CampoDeSenha, CampoDeTexto } from "@/components/ui/CampoDeTexto";
import { clientAuth } from "@/lib/services/firebase-service";

type Situacao = "parado" | "entrando";

/** O Firebase devolve "Firebase: Error (auth/...)" — isto vira português. */
const MENSAGEM_POR_CODIGO: Record<string, string> = {
  "auth/invalid-email": "Esse e-mail não parece válido.",
  "auth/invalid-credential": "E-mail ou senha não conferem.",
  "auth/user-not-found": "Não encontramos uma conta com esse e-mail.",
  "auth/wrong-password": "Senha incorreta.",
  "auth/too-many-requests": "Muitas tentativas seguidas. Aguarde um instante.",
  "auth/network-request-failed": "Sem conexão com o serviço de login.",
};

function traduzirErro(erro: unknown): string {
  if (erro && typeof erro === "object" && "code" in erro) {
    const codigo = String((erro as { code: string }).code);
    if (MENSAGEM_POR_CODIGO[codigo]) {
      return MENSAGEM_POR_CODIGO[codigo];
    }
  }
  if (erro instanceof Error) {
    return erro.message.replace(/Firebase:\s*/i, "").trim();
  }
  return "Não foi possível entrar. Tente novamente.";
}

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [situacao, setSituacao] = useState<Situacao>("parado");
  const [erro, setErro] = useState("");

  useEffect(() => {
    // Quem já está logado não precisa ver esta tela.
    const cancelar = onAuthStateChanged(clientAuth, (usuario) => {
      if (usuario) {
        router.push("/home");
      }
    });

    return () => cancelar();
  }, [router]);

  async function entrar() {
    if (!email.trim() || !senha) {
      setErro("Preencha e-mail e senha.");
      return;
    }

    setSituacao("entrando");
    setErro("");

    try {
      await signInWithEmailAndPassword(clientAuth, email.trim(), senha);
      router.push("/home");
    } catch (falha) {
      setErro(traduzirErro(falha));
      setSituacao("parado");
    }
  }

  return (
    <MolduraDeAutenticacao
      titulo="Entrar na sua conta"
      apoio="Acompanhe seus imóveis salvos e as visitas agendadas."
      rodape={
        <>
          Ainda não tem conta?{" "}
          <Link href="/register" className="font-semibold text-laranja hover:underline">
            Criar agora
          </Link>
        </>
      }
    >
      <form
        className="flex flex-col gap-4"
        noValidate
        onSubmit={(evento) => {
          evento.preventDefault();
          void entrar();
        }}
      >
        <CampoDeTexto
          rotulo="E-mail"
          type="email"
          autoComplete="email"
          placeholder="voce@email.com"
          value={email}
          disabled={situacao === "entrando"}
          onChange={(evento) => {
            setEmail(evento.target.value);
            setErro("");
          }}
        />

        <CampoDeSenha
          rotulo="Senha"
          autoComplete="current-password"
          placeholder="Sua senha"
          value={senha}
          disabled={situacao === "entrando"}
          onChange={(evento) => {
            setSenha(evento.target.value);
            setErro("");
          }}
        />

        <Botao
          type="submit"
          tamanho="grande"
          className="mt-1 w-full rounded-[9px]"
          disabled={situacao === "entrando"}
        >
          {situacao === "entrando" ? <Carregando rotulo="Entrando" /> : "Entrar"}
        </Botao>

        {erro ? (
          <p role="alert" className="animate-surgir text-sm font-medium text-laranja-escuro">
            {erro}
          </p>
        ) : null}
      </form>
    </MolduraDeAutenticacao>
  );
}
