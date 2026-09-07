import { describe, expect, it } from "vitest";
import { agruparPorProximidade, type PontoNaTela } from "./agrupamento";

const onde = (ponto: PontoNaTela) => ponto;

describe("agruparPorProximidade", () => {
  it("deixa em paz pontos que já estão distantes", () => {
    const grupos = agruparPorProximidade([{ x: 0, y: 0 }, { x: 200, y: 0 }], onde, 34);

    expect(grupos).toHaveLength(2);
    expect(grupos.every((grupo) => grupo.itens.length === 1)).toBe(true);
  });

  it("junta os que se encostam — o caso Juazeiro/Petrolina", () => {
    const grupos = agruparPorProximidade([{ x: 100, y: 100 }, { x: 108, y: 103 }], onde, 34);

    expect(grupos).toHaveLength(1);
    expect(grupos[0].itens).toHaveLength(2);
  });

  it("separa quando o zoom afasta os pontos além do raio", () => {
    const perto = agruparPorProximidade([{ x: 100, y: 100 }, { x: 120, y: 100 }], onde, 34);
    const longe = agruparPorProximidade([{ x: 100, y: 100 }, { x: 180, y: 100 }], onde, 34);

    expect(perto).toHaveLength(1);
    expect(longe).toHaveLength(2);
  });

  it("põe o grupo no meio do que ele representa, não em cima do primeiro", () => {
    const grupos = agruparPorProximidade([{ x: 100, y: 100 }, { x: 110, y: 120 }], onde, 34);

    expect(grupos[0].x).toBeCloseTo(105);
    expect(grupos[0].y).toBeCloseTo(110);
  });

  it("acumula três pontos encadeados num grupo só", () => {
    const grupos = agruparPorProximidade(
      [{ x: 100, y: 100 }, { x: 110, y: 100 }, { x: 118, y: 100 }],
      onde,
      34,
    );

    expect(grupos).toHaveLength(1);
    expect(grupos[0].itens).toHaveLength(3);
  });

  it("não perde nem duplica ninguém", () => {
    const pontos = [
      { x: 0, y: 0 },
      { x: 5, y: 5 },
      { x: 300, y: 20 },
      { x: 305, y: 25 },
      { x: 900, y: 900 },
    ];

    const grupos = agruparPorProximidade(pontos, onde, 34);
    const reunidos = grupos.flatMap((grupo) => grupo.itens);

    expect(reunidos).toHaveLength(pontos.length);
    expect(new Set(reunidos).size).toBe(pontos.length);
  });

  it("devolve lista vazia para entrada vazia", () => {
    expect(agruparPorProximidade([], onde, 34)).toEqual([]);
  });

  it("com raio zero, ninguém agrupa", () => {
    const grupos = agruparPorProximidade([{ x: 10, y: 10 }, { x: 10, y: 10 }], onde, 0);

    expect(grupos).toHaveLength(2);
  });
});
