import { describe, expect, it } from "vitest";
import { CATEGORIAS, CIDADES, IMOVEIS, TRANSACOES } from "./catalogo";

describe("catálogo", () => {
  it("tem o mesmo tamanho do seed do Prisma", () => {
    expect(IMOVEIS).toHaveLength(28);
    expect(CIDADES).toHaveLength(12);
    expect(CATEGORIAS).toHaveLength(8);
    expect(TRANSACOES).toHaveLength(2);
  });

  it("numera os imóveis de 1 a 28, sem repetir e sem buraco", () => {
    expect(IMOVEIS.map((imovel) => imovel.id)).toEqual(
      Array.from({ length: 28 }, (_, posicao) => posicao + 1),
    );
  });

  it("abre o imóvel certo pela posição — é o que o link compartilhado promete", () => {
    expect(IMOVEIS[0].registro).toBe("EI-1001");
    expect(IMOVEIS[8].registro).toBe("EI-1009");
    expect(IMOVEIS[27].registro).toBe("EI-1028");
  });

  it("traz as relações resolvidas e coerentes com os ids", () => {
    for (const imovel of IMOVEIS) {
      expect(imovel.city?.id, imovel.registro).toBe(imovel.cityId);
      expect(imovel.category?.id, imovel.registro).toBe(imovel.categoryId);
      expect(imovel.transacao?.id, imovel.registro).toBe(imovel.transacaoId);
    }
  });

  it("nomeia cada relação com o que está no catálogo de opções", () => {
    for (const imovel of IMOVEIS) {
      const cidade = CIDADES.find((opcao) => opcao.id === imovel.cityId);
      const categoria = CATEGORIAS.find((opcao) => opcao.id === imovel.categoryId);
      const transacao = TRANSACOES.find((opcao) => opcao.id === imovel.transacaoId);

      expect(imovel.city?.nomeCidade, imovel.registro).toBe(cidade?.nome);
      expect(imovel.category?.nomeCategoria, imovel.registro).toBe(categoria?.nome);
      expect(imovel.transacao?.nomeTransacao, imovel.registro).toBe(transacao?.nome);
    }
  });

  it("só usa os dois negócios que o seed cadastra", () => {
    expect(TRANSACOES.map((opcao) => opcao.nome)).toEqual(["Venda", "Locação"]);
  });

  it("descreve cada imóvel por inteiro — campo vazio vira tela quebrada", () => {
    for (const imovel of IMOVEIS) {
      expect(imovel.registro, imovel.registro).toMatch(/^EI-\d{4}$/);
      expect(imovel.endereco.length, imovel.registro).toBeGreaterThan(0);
      expect(imovel.descricao.length, imovel.registro).toBeGreaterThan(0);
      expect(imovel.urlImagem.length, imovel.registro).toBeGreaterThan(0);
      expect(imovel.preco, imovel.registro).toBeGreaterThan(0);
      expect(imovel.area, imovel.registro).toBeGreaterThan(0);
    }
  });

  it("não repete referência entre imóveis", () => {
    const registros = IMOVEIS.map((imovel) => imovel.registro);
    expect(new Set(registros).size).toBe(registros.length);
  });

  it("serve foto local ou do Unsplash, os dois hosts que o Next libera", () => {
    for (const imovel of IMOVEIS) {
      const liberada =
        imovel.urlImagem.startsWith("/imoveis/") ||
        imovel.urlImagem.startsWith("https://images.unsplash.com/");

      expect(liberada, `${imovel.registro}: ${imovel.urlImagem}`).toBe(true);
    }
  });
});
