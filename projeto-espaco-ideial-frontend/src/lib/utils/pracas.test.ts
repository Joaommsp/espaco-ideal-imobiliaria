import { describe, expect, it } from "vitest";
import { CIDADES, IMOVEIS } from "@/lib/mocks/catalogo";
import { PRACAS_INTERNACIONAIS } from "@/data/atuacao";
import { montarPracas } from "./pracas";

const pracas = montarPracas(CIDADES, IMOVEIS);

describe("praças do globo", () => {
  it("marca as 12 cidades do catálogo mais as internacionais", () => {
    expect(pracas).toHaveLength(CIDADES.length + PRACAS_INTERNACIONAIS.length);
  });

  it("conta os imóveis de cada cidade", () => {
    const total = pracas
      .filter((praca) => praca.pais === "Brasil")
      .reduce((soma, praca) => soma + praca.imoveis, 0);

    expect(total).toBe(IMOVEIS.length);
  });

  it("dá coordenada de verdade a toda cidade brasileira — [0,0] cai no Atlântico", () => {
    for (const praca of pracas.filter((item) => item.pais === "Brasil")) {
      expect(praca.coordenada, praca.nome).not.toEqual([0, 0]);
    }
  });

  it("ordena da praça maior para a menor", () => {
    const brasileiras = pracas.filter((praca) => praca.pais === "Brasil");
    const contagens = brasileiras.map((praca) => praca.imoveis);

    expect(contagens).toEqual([...contagens].sort((a, b) => b - a));
  });

  it("ilustra cada praça com foto de imóvel daquela cidade, não de outra", () => {
    for (const praca of pracas.filter((item) => item.pais === "Brasil")) {
      if (!praca.imagem) continue;

      const cidade = CIDADES.find((opcao) => opcao.nome === praca.nome);
      const daCidade = IMOVEIS.filter((imovel) => imovel.cityId === cidade?.id);

      expect(daCidade.map((imovel) => imovel.urlImagem), praca.nome).toContain(praca.imagem);
    }
  });
});
