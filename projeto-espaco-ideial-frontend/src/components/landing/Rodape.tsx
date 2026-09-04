import Image from "next/image";
import Link from "next/link";
import { PRACAS, TOTAL_DE_CIDADES } from "@/data/atuacao";
import { CONTATO } from "@/data/contato";
import logo from "../../../public/images/logo-full-horizontal-light.png";

export function Rodape() {
  const ano = new Date().getFullYear();

  return (
    <footer id="contato" className="bg-grafite text-white/80">
      <div className="mx-auto grid max-w-[1180px] gap-10 px-6 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Image src={logo} alt="Espaço Ideal Imobiliária" className="h-9 w-auto" />
          <p className="mt-3 max-w-[38ch] text-sm text-white/60">
            Compra e locação de imóveis com corretor que conhece o bairro. Atendimento em{" "}
            {TOTAL_DE_CIDADES} praças.
          </p>
        </div>

        <div>
          <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-laranja">Onde atuamos</h2>
          <ul className="grid gap-2 text-sm">
            {PRACAS.map((praca) => (
              <li key={praca.nome}>
                {praca.nome} <span className="text-white/45">· {praca.imoveis} imóveis</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-laranja">Fale com a gente</h2>
          <ul className="grid gap-2 text-sm">
            <li>
              <a href={`mailto:${CONTATO.email}`} className="hover:text-white">
                {CONTATO.email}
              </a>
            </li>
            <li>
              <a href={CONTATO.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                {CONTATO.telefone}
              </a>
            </li>
            <li>
              <Link href="/properties" className="hover:text-white">
                Ver todos os imóveis
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-[1180px] px-6 py-5 text-xs text-white/45">
          © {ano} Espaço Ideal Imobiliária. Projeto de portfólio — imóveis e praças internacionais
          são fictícios.
        </p>
      </div>
    </footer>
  );
}
