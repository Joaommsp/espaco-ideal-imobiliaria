"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AgendarVisita } from "@/components/imoveis/AgendarVisita";
import { AvisoDeErro } from "@/components/imoveis/AvisoDeErro";
import { BotaoLink } from "@/components/ui/Botao";
import { CONTATO } from "@/data/contato";
import { buscarImovel } from "@/lib/services/imoveis";
import type { Imovel } from "@/lib/types/imovel";
import { formatarArea, formatarBRL } from "@/lib/utils/formatters";
import { ehLocacao, localDoImovel, tituloDoImovel } from "@/lib/utils/imovel";
import { useAuth } from "../../../contexts/AuthContext";

type Situacao = "carregando" | "pronto" | "erro";

export default function PaginaDoImovel({ params }: { params: { id: string } }) {
  const { userName } = useAuth();
  const [imovel, setImovel] = useState<Imovel | null>(null);
  const [situacao, setSituacao] = useState<Situacao>("carregando");
  const [erro, setErro] = useState("");

  const carregar = useCallback(async () => {
    setSituacao("carregando");
    setErro("");

    try {
      setImovel(await buscarImovel(params.id));
      setSituacao("pronto");
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : "Erro ao carregar o imóvel.");
      setSituacao("erro");
    }
  }, [params.id]);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  if (situacao === "carregando") {
    return (
      <main className="min-h-dvh bg-areia">
        <div className="mx-auto max-w-[1180px] px-6 py-10" aria-busy>
          <div className="h-4 w-40 animate-pulse rounded bg-areia-escura" />
          <div className="mt-5 aspect-[16/9] w-full animate-pulse rounded-cartao bg-areia-escura" />
          <div className="mt-6 h-8 w-2/3 animate-pulse rounded bg-areia-escura" />
          <div className="mt-3 h-4 w-1/3 animate-pulse rounded bg-areia-escura" />
        </div>
      </main>
    );
  }

  if (situacao === "erro" || !imovel) {
    return (
      <main className="min-h-dvh bg-areia">
        <div className="mx-auto max-w-[720px] px-6 py-16">
          <AvisoDeErro
            titulo="Não conseguimos carregar este imóvel"
            mensagem={erro}
            aoTentarNovamente={carregar}
          />
          <div className="mt-6 text-center">
            <BotaoLink href="/properties" variante="contorno">
              Ver todos os imóveis
            </BotaoLink>
          </div>
        </div>
      </main>
    );
  }

  const locacao = ehLocacao(imovel);

  const fichaTecnica = [
    { rotulo: "Negócio", valor: imovel.transacao?.nomeTransacao ?? "—" },
    { rotulo: "Tipo", valor: imovel.category?.nomeCategoria ?? "—" },
    { rotulo: "Cidade", valor: imovel.city?.nomeCidade ?? "—" },
    { rotulo: "Área total", valor: formatarArea(imovel.area) },
    { rotulo: "Quartos", valor: String(imovel.qtdQuartos) },
    { rotulo: "Vagas na garagem", valor: String(imovel.qtdVagasGaragem) },
    { rotulo: "Referência", valor: imovel.registro },
    // Fecha a grade em número par e é dado que quem compara imóvel procura.
    {
      rotulo: "Valor do m²",
      valor: imovel.area > 0 ? formatarBRL(imovel.preco / imovel.area) : "—",
    },
  ];

  return (
    <main className="min-h-dvh bg-areia pb-16">
      <div className="mx-auto max-w-[1180px] px-6 pt-8">
        <nav aria-label="Você está aqui" className="text-sm text-tinta-fraca">
          <Link href="/" className="hover:text-laranja">
            Início
          </Link>
          <span aria-hidden> / </span>
          <Link href="/properties" className="hover:text-laranja">
            Imóveis
          </Link>
          <span aria-hidden> / </span>
          <span className="text-tinta">{imovel.registro}</span>
        </nav>

        {/* Uma foto por imóvel é o que o cadastro guarda hoje: a página usa a
            imagem em destaque grande em vez de repetir a mesma duas vezes. */}
        <figure className="relative mt-4 aspect-[16/9] overflow-hidden rounded-cartao bg-areia-escura">
          <Image
            src={imovel.urlImagem}
            alt={`Foto de ${tituloDoImovel(imovel)}`}
            fill
            priority
            sizes="(max-width: 1180px) 100vw, 1180px"
            className="object-cover"
          />
          <figcaption
            className={[
              "absolute left-4 top-4 rounded-full px-3 py-1.5 text-[0.72rem] font-semibold uppercase tracking-wider text-white",
              locacao ? "bg-grafite/85" : "bg-laranja",
            ].join(" ")}
          >
            {imovel.transacao?.nomeTransacao ?? "Disponível"}
          </figcaption>
        </figure>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <h1 className="font-display text-[clamp(1.8rem,4vw,2.6rem)] font-semibold leading-tight">
              {tituloDoImovel(imovel)}
            </h1>
            <p className="mt-2 text-tinta-suave">{imovel.endereco}</p>

            <p className="mt-5 font-display text-3xl font-semibold">
              {formatarBRL(imovel.preco)}
              {locacao ? (
                <span className="font-corpo text-base font-medium text-tinta-fraca">/mês</span>
              ) : null}
            </p>

            <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3 border-y border-areia-linha py-4 text-sm">
              <li>
                <b className="font-semibold">{imovel.qtdQuartos}</b>{" "}
                <span className="text-tinta-suave">
                  {imovel.qtdQuartos === 1 ? "quarto" : "quartos"}
                </span>
              </li>
              <li>
                <b className="font-semibold">{imovel.qtdVagasGaragem}</b>{" "}
                <span className="text-tinta-suave">
                  {imovel.qtdVagasGaragem === 1 ? "vaga" : "vagas"}
                </span>
              </li>
              <li>
                <b className="font-semibold">{formatarArea(imovel.area)}</b>{" "}
                <span className="text-tinta-suave">de área</span>
              </li>
              <li>
                <b className="font-semibold">{localDoImovel(imovel)}</b>
              </li>
            </ul>

            <section className="mt-7">
              <h2 className="font-display text-xl">Sobre o imóvel</h2>
              <p className="mt-3 max-w-[68ch] leading-relaxed text-tinta-suave">
                {imovel.descricao}
              </p>
            </section>

            <section className="mt-8">
              <h2 className="font-display text-xl">Ficha técnica</h2>
              <dl className="mt-3 grid gap-px overflow-hidden rounded-cartao border border-areia-linha bg-areia-linha sm:grid-cols-2">
                {fichaTecnica.map((item) => (
                  <div
                    key={item.rotulo}
                    className="flex items-baseline justify-between gap-4 bg-white px-4 py-3 text-sm"
                  >
                    <dt className="text-tinta-fraca">{item.rotulo}</dt>
                    <dd className="font-semibold">{item.valor}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>

          <aside className="lg:sticky lg:top-6 lg:self-start">
            <AgendarVisita
              imovelId={imovel.id}
              endereco={imovel.endereco}
              nomeDoUsuario={String(userName ?? "")}
            />

            <div className="mt-4 rounded-cartao border border-areia-linha bg-white p-5">
              <h2 className="font-display text-lg">Falar com um corretor</h2>
              <p className="mt-1.5 text-sm text-tinta-suave">
                Tire dúvidas sobre documentação, condições e financiamento.
              </p>
              <BotaoLink
                href={CONTATO.whatsapp}
                externo
                variante="grafite"
                className="mt-4 w-full"
              >
                Chamar no WhatsApp
              </BotaoLink>
            </div>

            <BotaoLink href="/properties" variante="contorno" className="mt-4 w-full">
              Ver outros imóveis
            </BotaoLink>
          </aside>
        </div>
      </div>
    </main>
  );
}
