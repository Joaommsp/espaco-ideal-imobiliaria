import { AindaNaoExiste } from "@/components/painel/AindaNaoExiste";
import { TopoDaPagina } from "@/components/painel/TopoDaPagina";

export const metadata = { title: "Categorias" };

export default function PaginaDeCategorias() {
  return (
    <>
      <TopoDaPagina titulo="Categorias" resumo="Tipos de imóvel do catálogo" />
      <AindaNaoExiste
        recurso="Categorias"
        explicacao="A API já lê e grava categorias, mas o cadastro por aqui ainda não foi construído. Hoje elas entram pelo seed do banco."
        alternativa={{
          texto: "O tipo de cada imóvel é escolhido no próprio cadastro.",
          href: "/dashboard/properties",
          rotulo: "Ir para imóveis",
        }}
      />
    </>
  );
}
