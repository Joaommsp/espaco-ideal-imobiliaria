import { describe, expect, it } from "vitest";
import { primeiroProblema } from "./AgendarVisita";

const DIA = "2026-09-12";

describe("validação do agendamento", () => {
  it("aprova nome e dia, com WhatsApp em branco", () => {
    expect(primeiroProblema("Marina Cardoso", "", DIA)).toBeNull();
  });

  it("aprova com WhatsApp completo", () => {
    expect(primeiroProblema("Marina Cardoso", "(75) 99812-4407", DIA)).toBeNull();
  });

  it("cobra o nome, e diz que é o nome", () => {
    expect(primeiroProblema("", "", DIA)).toMatch(/nome/i);
  });

  it("não aceita nome só de espaços", () => {
    expect(primeiroProblema("   ", "", DIA)).toMatch(/nome/i);
  });

  it("cobra o dia, e diz que é o dia", () => {
    expect(primeiroProblema("Marina Cardoso", "", "")).toMatch(/dia/i);
  });

  it("reclama do WhatsApp incompleto, sem cobrar quem deixou em branco", () => {
    expect(primeiroProblema("Marina Cardoso", "(75) 9981", DIA)).toMatch(/WhatsApp/i);
    expect(primeiroProblema("Marina Cardoso", "", DIA)).toBeNull();
  });

  it("cobra o nome antes do dia — o formulário aponta um problema por vez, de cima para baixo", () => {
    expect(primeiroProblema("", "", "")).toMatch(/nome/i);
  });
});
