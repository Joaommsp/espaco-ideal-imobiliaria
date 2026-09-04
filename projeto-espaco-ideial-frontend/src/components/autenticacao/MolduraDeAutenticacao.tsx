import Image from "next/image";
import Link from "next/link";
import logoClara from "../../../public/images/logo-full-horizontal-light.png";
import logoEscura from "../../../public/images/logo-full-horizontal-dark.png";

/**
 * Moldura das telas de entrar e criar conta: metade grafite com a marca e o
 * argumento, metade clara com o formulário. No celular vira uma coluna só.
 */
export function MolduraDeAutenticacao({
  titulo,
  apoio,
  children,
  rodape,
}: {
  titulo: string;
  apoio: string;
  children: React.ReactNode;
  rodape: React.ReactNode;
}) {
  return (
    <main className="grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      <section className="relative hidden flex-col justify-between overflow-hidden bg-grafite p-10 text-white lg:flex">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(70%_50%_at_30%_20%,theme(colors.laranja.DEFAULT/18%),transparent_70%)]"
        />

        <Link href="/" className="relative z-10 w-fit" aria-label="Espaço Ideal — início">
          <Image src={logoClara} alt="Espaço Ideal Imobiliária" className="h-9 w-auto" priority />
        </Link>

        <div className="relative z-10 max-w-[34ch]">
          <p className="font-display text-[2.4rem] font-semibold leading-[1.1]">
            Encontre onde <span className="text-laranja">morar bem</span>
          </p>
          <p className="mt-4 text-white/60">
            Salve os imóveis que gostou, agende visitas e acompanhe tudo num lugar só.
          </p>
        </div>

        <p className="relative z-10 text-[0.78rem] text-white/40">
          © {new Date().getFullYear()} Espaço Ideal Imobiliária
        </p>
      </section>

      <section className="flex flex-col justify-center bg-areia px-6 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-[26rem]">
          <Link href="/" className="mb-8 inline-block lg:hidden" aria-label="Espaço Ideal — início">
            <Image src={logoEscura} alt="Espaço Ideal" className="h-8 w-auto" />
          </Link>

          <h1 className="font-display text-[2rem] font-semibold leading-tight">{titulo}</h1>
          <p className="mt-2 text-tinta-suave">{apoio}</p>

          <div className="mt-8">{children}</div>

          <div className="mt-7 text-sm text-tinta-suave">{rodape}</div>
        </div>
      </section>
    </main>
  );
}
