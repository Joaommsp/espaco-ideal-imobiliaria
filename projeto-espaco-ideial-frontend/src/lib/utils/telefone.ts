/**
 * Máscara e validação de telefone brasileiro. Ficam aqui, fora do componente,
 * porque são regra pura: o formulário só decide o que fazer com o veredito.
 */

const MINIMO_DE_DIGITOS = 10; // fixo com DDD
const MAXIMO_DE_DIGITOS = 11; // celular com o nono dígito

export function apenasDigitos(valor: string): string {
  return valor.replace(/\D/g, "");
}

/**
 * Formata enquanto se digita, então precisa dar conta do número pela metade:
 * "75" vira "(75", "759981" vira "(75) 9981". Cortar em 11 dígitos evita que
 * um colar acidental estufe o campo.
 */
export function formatarTelefone(valor: string): string {
  const digitos = apenasDigitos(valor).slice(0, MAXIMO_DE_DIGITOS);

  if (digitos.length === 0) return "";
  if (digitos.length <= 2) return `(${digitos}`;

  const ddd = digitos.slice(0, 2);
  const resto = digitos.slice(2);

  // O hífen só entra quando o número já está completo. Colocá-lo antes disso
  // o faz saltar de posição no oitavo dígito, quando fica claro que é celular
  // e não fixo — e o campo pisca embaixo do cursor.
  if (resto.length < 8) return `(${ddd}) ${resto}`;

  const corte = resto.length - 4;
  return `(${ddd}) ${resto.slice(0, corte)}-${resto.slice(corte)}`;
}

/** Campo vazio não é telefone inválido — o WhatsApp é opcional no formulário. */
export function telefoneValido(valor: string): boolean {
  const digitos = apenasDigitos(valor);
  return digitos.length >= MINIMO_DE_DIGITOS && digitos.length <= MAXIMO_DE_DIGITOS;
}
