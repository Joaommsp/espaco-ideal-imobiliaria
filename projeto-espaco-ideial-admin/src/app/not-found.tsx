import { BotaoLink } from "@/components/ui/Botao";

export default function PaginaNaoEncontrada() {
  return (
    <main className="grid min-h-dvh place-items-center bg-areia px-6">
      <div className="max-w-[40ch] text-center">
        <p className="font-display text-5xl font-semibold text-laranja">404</p>
        <h1 className="mt-3 font-display text-2xl font-semibold">Esta página não existe</h1>
        <p className="mt-3 text-tinta-suave">
          O endereço pode ter mudado, ou a tela ainda não foi construída.
        </p>
        <BotaoLink href="/dashboard/properties" variante="grafite" className="mt-6">
          Voltar para o painel
        </BotaoLink>
      </div>
    </main>
  );
}
