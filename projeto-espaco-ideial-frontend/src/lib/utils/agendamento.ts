import { telefoneValido } from "@/lib/utils/telefone";

/**
 * As regras do agendamento — datas e validação — vivem fora do componente,
 * como as do telefone. São puras, e é o que permite testá-las sem carregar
 * React só para perguntar se um nome está em branco.
 */

/** Erros por campo. Campo ausente da lista é campo aprovado. */
export interface ProblemasDoAgendamento {
  nome?: string;
  telefone?: string;
  data?: string;
}

/**
 * Data mínima é hoje — em horário local. Com toISOString() o valor vira UTC:
 * depois das 21h em Brasília o "hoje" já virava amanhã e a pessoa não
 * conseguia marcar para o próprio dia.
 */
export function hoje(referencia: Date = new Date()): string {
  return [
    referencia.getFullYear(),
    String(referencia.getMonth() + 1).padStart(2, "0"),
    String(referencia.getDate()).padStart(2, "0"),
  ].join("-");
}

/**
 * O <input type="date"> devolve "2026-09-10", que o construtor Date lê como
 * meia-noite UTC — em Brasília isso é dia 9 às 21h, e era esse dia que ia
 * parar no registro. Montando ao meio-dia local, a data é a escolhida em
 * qualquer fuso do país.
 */
export function paraDataLocal(valor: string): Date {
  const [ano, mes, dia] = valor.split("-").map(Number);
  return new Date(ano, mes - 1, dia, 12, 0, 0);
}

/**
 * Sem conta de usuário, o nome precisa vir do próprio formulário — antes ele
 * saía da sessão. O telefone é opcional: quem prefere ser chamado por e-mail
 * não deveria travar no campo.
 */
export function validarAgendamento(
  nome: string,
  telefone: string,
  data: string,
): ProblemasDoAgendamento {
  const problemas: ProblemasDoAgendamento = {};

  if (!nome.trim()) {
    problemas.nome = "Diga seu nome para o corretor saber quem procurar.";
  }

  if (telefone && !telefoneValido(telefone)) {
    problemas.telefone = "Falta DDD ou dígito — confira o número.";
  }

  if (!data) {
    problemas.data = "Escolha o dia da visita.";
  }

  return problemas;
}

export function temProblema(problemas: ProblemasDoAgendamento): boolean {
  return Object.keys(problemas).length > 0;
}
