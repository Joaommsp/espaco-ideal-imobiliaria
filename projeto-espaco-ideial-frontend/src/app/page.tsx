import Image from "next/image";
import Link from "next/link";
import { BarraDeBusca } from "@/components/landing/BarraDeBusca";
import { Cabecalho } from "@/components/landing/Cabecalho";
import { Globo } from "@/components/landing/Globo";
import { OrbitaDeCidades } from "@/components/landing/OrbitaDeCidades";
import { Rodape } from "@/components/landing/Rodape";
import { AvisoDeErro } from "@/components/imoveis/AvisoDeErro";
import { BotaoLink } from "@/components/ui/Botao";
import { CardDeImovel } from "@/components/ui/CardDeImovel";
import { ANOS_DE_MERCADO, AVALIACAO_MEDIA, TOTAL_DE_CIDADES, TOTAL_DE_IMOVEIS } from "@/data/atuacao";
import { CONTATO } from "@/data/contato";
import { montarPracas } from "@/lib/utils/pracas";
import {
  listarCategorias,
  listarCidades,
  listarImoveis,
  listarTransacoes,
} from "@/lib/services/imoveis";
import type { Imovel, Opcao } from "@/lib/types/imovel";

const SEM_OPCOES: Opcao[] = [];
const SEM_IMOVEIS: Imovel[] = [];

/**
 * Falha de rede e catálogo vazio são coisas diferentes: engolir o erro faria
 * a tela dizer "nenhum imóvel" quando na verdade a API não respondeu.
 */
function resultadoOu<T>(resultado: PromiseSettledResult<T>, padrao: T) {
  return {
    dados: resultado.status === "fulfilled" ? resultado.value : padrao,
    erro:
      resultado.status === "rejected"
        ? resultado.reason instanceof Error
          ? resultado.reason.message
          : "A API não respondeu."
        : null,
  };
}

const ETAPAS = [
  {
    titulo: "Escolha o que procura",
    texto: "Filtre por cidade, tipo de imóvel, quartos e vagas. Só aparece o que existe de verdade.",
  },
  {
    titulo: "Agende a visita",
    texto: "Marque no site o dia e a hora. Um corretor da praça acompanha você no imóvel.",
  },
  {
    titulo: "Feche o negócio",
    texto: "Documentação conferida pela nossa equipe, do contrato à entrega das chaves.",
  },
];

/** A landing é a porta de entrada: precisa dos dados do catálogo já na primeira pintura. */
export default async function PaginaInicial() {
  const [respostaImoveis, respostaCidades, respostaCategorias, respostaTransacoes] =
    await Promise.allSettled([
      listarImoveis(),
      listarCidades(),
      listarCategorias(),
      listarTransacoes(),
    ]);

  const catalogo = resultadoOu(respostaImoveis, SEM_IMOVEIS);
  const cidades = resultadoOu(respostaCidades, SEM_OPCOES).dados;
  const categorias = resultadoOu(respostaCategorias, SEM_OPCOES).dados;
  const transacoes = resultadoOu(respostaTransacoes, SEM_OPCOES).dados;

  const imoveis = catalogo.dados;
  const destaques = imoveis.slice(0, 3);

  // Praças com contagem e foto do próprio catálogo.
  const pracas = montarPracas(cidades, imoveis);

  return (
    <>
      <section className="relative overflow-hidden bg-grafite">
        <Cabecalho />

        <div className="relative z-20 px-6 pt-14 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/[0.08] px-4 py-1.5 text-[0.78rem] text-white/80 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.16)]">
            <b className="font-semibold text-white">{AVALIACAO_MEDIA}</b> de avaliação ·
            <b className="font-semibold text-white">{imoveis.length || TOTAL_DE_IMOVEIS}</b>{" "}
            imóveis ativos
          </span>

          <h1 className="mx-auto mt-5 max-w-[16ch] font-display text-[clamp(2.3rem,5.6vw,4rem)] font-semibold leading-[1.05] text-white">
            Um lugar para chamar de <em className="font-normal not-italic text-laranja">seu</em>
          </h1>
          <p className="mx-auto mt-4 max-w-[52ch] text-white/65">
            Casas, apartamentos e salas comerciais em {TOTAL_DE_CIDADES} praças — e agora também
            fora do país.
          </p>

          <BarraDeBusca
            cidades={cidades}
            categorias={categorias}
            transacoes={transacoes}
            imoveis={imoveis}
          />
        </div>

        <div className="relative -mt-6 h-[320px] md:h-[460px]">
          <div
            aria-hidden
            className="absolute inset-0 z-[15] bg-[radial-gradient(60%_50%_at_50%_62%,theme(colors.laranja.DEFAULT/22%),transparent_70%)]"
          />
          <div className="absolute inset-0 z-10 overflow-hidden">
            <Globo pracas={pracas} />
          </div>

          <OrbitaDeCidades pracas={pracas} />
        </div>
      </section>

      <main className="bg-areia">
        <section className="mx-auto max-w-[1180px] px-6 py-16">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
            <div>
              <h2 className="font-display text-[clamp(1.6rem,3.4vw,2.3rem)] font-semibold">
                Imóveis em destaque
              </h2>
              <p className="mt-2 max-w-[52ch] text-tinta-suave">
                Selecionados pela equipe entre os anúncios da semana.
              </p>
            </div>
            <Link
              href="/properties"
              className="border-b border-laranja pb-0.5 text-sm text-tinta hover:text-laranja"
            >
              Ver todos os imóveis →
            </Link>
          </div>

          {catalogo.erro ? (
            <AvisoDeErro mensagem={catalogo.erro} />
          ) : destaques.length === 0 ? (
            <div className="rounded-cartao border border-dashed border-areia-linha px-6 py-14 text-center">
              <h3 className="font-display text-xl">Nenhum imóvel anunciado no momento</h3>
              <p className="mx-auto mt-2 max-w-[46ch] text-sm text-tinta-suave">
                Assim que um novo imóvel entrar no catálogo, ele aparece aqui.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {destaques.map((imovel) => (
                <CardDeImovel key={imovel.id} imovel={imovel} />
              ))}
            </div>
          )}

          <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-cartao border border-areia-linha bg-areia-linha md:grid-cols-4">
            {[
              {
                valor: String(imoveis.length || TOTAL_DE_IMOVEIS),
                rotulo: "imóveis anunciados",
              },
              { valor: String(TOTAL_DE_CIDADES), rotulo: "praças atendidas" },
              { valor: AVALIACAO_MEDIA, rotulo: "avaliação dos clientes" },
              { valor: `${ANOS_DE_MERCADO} anos`, rotulo: "de mercado" },
            ].map((item) => (
              <div key={item.rotulo} className="bg-white px-5 py-5">
                <dd className="font-display text-3xl font-semibold leading-none">{item.valor}</dd>
                <dt className="mt-1.5 text-[0.78rem] text-tinta-fraca">{item.rotulo}</dt>
              </div>
            ))}
          </dl>
        </section>

        <section id="cidades" className="mx-auto max-w-[1180px] scroll-mt-20 px-6 pb-16">
          <h2 className="font-display text-[clamp(1.6rem,3.4vw,2.3rem)] font-semibold">
            Onde a gente atua
          </h2>
          <p className="mt-2 max-w-[52ch] text-tinta-suave">
            Cada praça com corretor próprio, que conhece o bairro de verdade.
          </p>

          <ul className="mt-7 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {pracas.map((praca, indice) => (
              // A foto é de um imóvel daquela cidade. Praça sem imóvel
              // cadastrado (as internacionais) cai no degradê.
              <li
                key={praca.nome}
                className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-gradient-to-br from-grafite-claro to-grafite"
              >
                {praca.imagem ? (
                  <Image
                    src={praca.imagem}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 45vw, 190px"
                    className="object-cover opacity-70 transition-[transform,opacity] duration-500 group-hover:scale-105 group-hover:opacity-85"
                  />
                ) : (
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-1 bg-laranja"
                    style={{ opacity: 0.35 + indice * 0.1 }}
                  />
                )}
                <span
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-grafite via-grafite/40 to-transparent"
                />
                <span className="absolute bottom-3 left-3 z-10 text-white">
                  <b className="block font-display text-base">{praca.nome}</b>
                  <span className="text-[0.74rem] text-white/70">
                    {praca.pais} · {praca.imoveis} imóveis
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section id="como-funciona" className="bg-areia-escura py-16">
          <div className="mx-auto max-w-[1180px] scroll-mt-20 px-6">
            <h2 className="font-display text-[clamp(1.6rem,3.4vw,2.3rem)] font-semibold">
              Como funciona
            </h2>
            <ol className="mt-8 grid gap-5 md:grid-cols-3">
              {ETAPAS.map((etapa, indice) => (
                <li key={etapa.titulo} className="rounded-cartao border border-areia-linha bg-white p-6">
                  <span className="font-display text-3xl font-semibold text-laranja">
                    {indice + 1}
                  </span>
                  <h3 className="mt-3 font-display text-lg">{etapa.titulo}</h3>
                  <p className="mt-2 text-sm text-tinta-suave">{etapa.texto}</p>
                </li>
              ))}
            </ol>

            <div className="mt-10 flex flex-wrap items-center gap-4 rounded-cartao bg-grafite px-7 py-7 text-white">
              <div className="flex-1">
                <h3 className="font-display text-xl">Tem um imóvel para vender ou alugar?</h3>
                <p className="mt-1.5 text-sm text-white/65">
                  Anuncie com quem já atende {TOTAL_DE_CIDADES} praças.
                </p>
              </div>
              <BotaoLink href={CONTATO.whatsapp} externo tamanho="grande">
                Anunciar meu imóvel
              </BotaoLink>
            </div>
          </div>
        </section>
      </main>

      <Rodape />
    </>
  );
}
