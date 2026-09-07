import { describe, expect, it } from "vitest";
import { hoje, paraDataLocal, temProblema, validarAgendamento } from "./agendamento";

const DIA = "2026-09-12";

describe("validarAgendamento", () => {
  it("aprova nome e dia, com WhatsApp em branco", () => {
    expect(validarAgendamento("Marina Cardoso", "", DIA)).toEqual({});
  });

  it("aprova com WhatsApp completo", () => {
    expect(validarAgendamento("Marina Cardoso", "(75) 99812-4407", DIA)).toEqual({});
  });

  it("cobra o nome no campo do nome", () => {
    const problemas = validarAgendamento("", "", DIA);
    expect(problemas.nome).toMatch(/nome/i);
    expect(problemas.data).toBeUndefined();
  });

  it("não aceita nome só de espaços", () => {
    expect(validarAgendamento("   ", "", DIA).nome).toBeDefined();
  });

  it("cobra o dia no campo do dia", () => {
    const problemas = validarAgendamento("Marina Cardoso", "", "");
    expect(problemas.data).toMatch(/dia/i);
    expect(problemas.nome).toBeUndefined();
  });

  it("reclama de WhatsApp incompleto, mas não de WhatsApp vazio", () => {
    expect(validarAgendamento("Marina Cardoso", "(75) 9981", DIA).telefone).toBeDefined();
    expect(validarAgendamento("Marina Cardoso", "", DIA).telefone).toBeUndefined();
  });

  it("aponta os três de uma vez — cada campo mostra o seu", () => {
    const problemas = validarAgendamento("", "(75) 9981", "");
    expect(Object.keys(problemas).sort()).toEqual(["data", "nome", "telefone"]);
  });
});

describe("temProblema", () => {
  it("distingue formulário aprovado de formulário com pendência", () => {
    expect(temProblema({})).toBe(false);
    expect(temProblema({ nome: "faltou" })).toBe(true);
  });
});

describe("hoje", () => {
  it("usa o calendário local, não o UTC", () => {
    // 31/12 às 22h em Brasília ainda é 31/12; em UTC já virou o ano.
    expect(hoje(new Date(2026, 11, 31, 22, 0, 0))).toBe("2026-12-31");
  });

  it("preenche mês e dia com dois dígitos, como o input espera", () => {
    expect(hoje(new Date(2026, 0, 5))).toBe("2026-01-05");
  });
});

describe("paraDataLocal", () => {
  it("mantém o dia escolhido, sem recuar um por causa do fuso", () => {
    const data = paraDataLocal("2026-09-10");

    expect(data.getFullYear()).toBe(2026);
    expect(data.getMonth()).toBe(8);
    expect(data.getDate()).toBe(10);
  });

  it("ancora ao meio-dia, que é o que protege o dia em qualquer fuso do país", () => {
    expect(paraDataLocal("2026-09-10").getHours()).toBe(12);
  });
});
