import { AindaNaoExiste } from "@/components/painel/AindaNaoExiste";
import { TopoDaPagina } from "@/components/painel/TopoDaPagina";

export const metadata = { title: "Cidades" };

export default function PaginaDeCidades() {
  return (
    <>
      <TopoDaPagina titulo="Cidades" resumo="Praças onde a imobiliária atua" />
      <AindaNaoExiste
        recurso="Cidades"
        explicacao="A API já lê e grava cidades, mas o cadastro por aqui ainda não foi construído. Hoje elas entram pelo seed do banco."
        alternativa={{
          texto: "Enquanto isso, a cidade de cada imóvel é escolhida no próprio cadastro.",
          href: "/dashboard/properties",
          rotulo: "Ir para imóveis",
        }}
      />
    </>
  );
}
