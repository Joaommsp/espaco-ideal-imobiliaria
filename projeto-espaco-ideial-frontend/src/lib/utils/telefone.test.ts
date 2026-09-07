import { describe, expect, it } from "vitest";
import { apenasDigitos, formatarTelefone, telefoneValido } from "./telefone";

describe("formatarTelefone", () => {
  it("formata o celular com nono dígito", () => {
    expect(formatarTelefone("75998124407")).toBe("(75) 99812-4407");
  });

  it("formata o fixo com DDD", () => {
    expect(formatarTelefone("7534020822")).toBe("(75) 3402-0822");
  });

  it("acompanha quem ainda está digitando", () => {
    expect(formatarTelefone("")).toBe("");
    expect(formatarTelefone("7")).toBe("(7");
    expect(formatarTelefone("75")).toBe("(75");
    expect(formatarTelefone("759")).toBe("(75) 9");
    expect(formatarTelefone("759981")).toBe("(75) 9981");
    expect(formatarTelefone("7599812")).toBe("(75) 99812");
  });

  it("ignora o que já está formatado, em vez de duplicar pontuação", () => {
    expect(formatarTelefone("(75) 99812-4407")).toBe("(75) 99812-4407");
  });

  it("para em onze dígitos, para um colar acidental não estufar o campo", () => {
    expect(formatarTelefone("759981244079999")).toBe("(75) 99812-4407");
  });
});

describe("telefoneValido", () => {
  it("aceita fixo com dez dígitos e celular com onze", () => {
    expect(telefoneValido("(75) 3402-0822")).toBe(true);
    expect(telefoneValido("(75) 99812-4407")).toBe(true);
  });

  it("recusa número curto demais para ter DDD", () => {
    expect(telefoneValido("998124407")).toBe(false);
    expect(telefoneValido("(75) 9981")).toBe(false);
  });

  it("recusa campo vazio — quem decide se é obrigatório é o formulário", () => {
    expect(telefoneValido("")).toBe(false);
  });
});

describe("apenasDigitos", () => {
  it("descarta tudo que não é número", () => {
    expect(apenasDigitos("(75) 99812-4407")).toBe("75998124407");
  });
});
