import { describe, expect, it } from "vitest";
import { IMOVEIS } from "@/lib/mocks/catalogo";
import {
  agendarVisita,
  buscarImoveis,
  buscarImovel,
  listarCategorias,
  listarCidades,
  listarImoveis,
  listarTransacoes,
} from "./imoveis";

describe("listarImoveis", () => {
  it("entrega o catálogo inteiro", async () => {
    await expect(listarImoveis()).resolves.toHaveLength(28);
  });

  it("entrega cópias — ordenar numa tela não pode bagunçar as outras", async () => {
    const lista = await listarImoveis();
    const precoOriginal = IMOVEIS[0].preco;

    lista[0].preco = -1;

    expect(IMOVEIS[0].preco).toBe(precoOriginal);
  });
});

describe("buscarImovel", () => {
  it("acha pelo id", async () => {
    await expect(buscarImovel(9)).resolves.toMatchObject({ id: 9, registro: "EI-1009" });
  });

  it("aceita o id como texto, que é como a rota entrega", async () => {
    await expect(buscarImovel("9")).resolves.toMatchObject({ registro: "EI-1009" });
  });

  it("recusa id que não existe, dizendo qual era", async () => {
    await expect(buscarImovel(999)).rejects.toThrow("999");
  });

  it("recusa id que não é número", async () => {
    await expect(buscarImovel("abc")).rejects.toThrow("abc");
  });

  it("recusa id fracionário em vez de arredondar para um imóvel qualquer", async () => {
    await expect(buscarImovel("9.5")).rejects.toThrow();
  });
});

describe("buscarImoveis", () => {
  it("exige que os cinco filtros batam ao mesmo tempo", async () => {
    const alvo = IMOVEIS[0];

    const resultado = await buscarImoveis({
      transacaoId: alvo.transacaoId,
      cityId: alvo.cityId,
      categoryId: alvo.categoryId,
      qtdQuartos: alvo.qtdQuartos,
      qtdVagasGaragem: alvo.qtdVagasGaragem,
    });

    expect(resultado.map((imovel) => imovel.registro)).toContain(alvo.registro);

    for (const imovel of resultado) {
      expect(imovel.transacaoId).toBe(alvo.transacaoId);
      expect(imovel.cityId).toBe(alvo.cityId);
      expect(imovel.categoryId).toBe(alvo.categoryId);
      expect(imovel.qtdQuartos).toBe(alvo.qtdQuartos);
      expect(imovel.qtdVagasGaragem).toBe(alvo.qtdVagasGaragem);
    }
  });

  it("descarta quem casa em quatro filtros e falha no quinto", async () => {
    const alvo = IMOVEIS[0];

    const resultado = await buscarImoveis({
      transacaoId: alvo.transacaoId,
      cityId: alvo.cityId,
      categoryId: alvo.categoryId,
      qtdQuartos: alvo.qtdQuartos,
      qtdVagasGaragem: alvo.qtdVagasGaragem + 7,
    });

    expect(resultado).toEqual([]);
  });

  it("compara por valor mesmo recebendo texto da rota", async () => {
    const alvo = IMOVEIS[0];

    const comTexto = await buscarImoveis({
      transacaoId: String(alvo.transacaoId),
      cityId: String(alvo.cityId),
      categoryId: String(alvo.categoryId),
      qtdQuartos: String(alvo.qtdQuartos),
      qtdVagasGaragem: String(alvo.qtdVagasGaragem),
    });

    expect(comTexto.length).toBeGreaterThan(0);
  });

  it("devolve lista vazia quando nada casa, sem lançar", async () => {
    await expect(
      buscarImoveis({
        transacaoId: 1,
        cityId: 1,
        categoryId: 1,
        qtdQuartos: 99,
        qtdVagasGaragem: 99,
      }),
    ).resolves.toEqual([]);
  });
});

describe("opções dos filtros", () => {
  it("devolve id e nome, que é o formato que os menus consomem", async () => {
    const [cidades, categorias, transacoes] = await Promise.all([
      listarCidades(),
      listarCategorias(),
      listarTransacoes(),
    ]);

    expect(cidades).toHaveLength(12);
    expect(categorias).toHaveLength(8);
    expect(transacoes).toHaveLength(2);

    expect(cidades[0]).toEqual({ id: 1, nome: "Paulo Afonso" });
    expect(transacoes.map((opcao) => opcao.nome)).toEqual(["Venda", "Locação"]);

    for (const opcao of [...cidades, ...categorias, ...transacoes]) {
      expect(Object.keys(opcao).sort()).toEqual(["id", "nome"]);
    }
  });
});

describe("agendarVisita", () => {
  it("conclui sem erro e devolve o que foi agendado", async () => {
    const pedido = {
      nome: "Marina Cardoso",
      telefone: "(75) 99812-4407",
      enderecoPropriedade: IMOVEIS[0].endereco,
      propertyId: IMOVEIS[0].id,
      data: new Date(2026, 8, 12, 12).toISOString(),
    };

    await expect(agendarVisita(pedido)).resolves.toEqual(pedido);
  });
});
