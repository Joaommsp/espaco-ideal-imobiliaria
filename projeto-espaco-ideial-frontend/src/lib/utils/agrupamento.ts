/**
 * Junta pontos que caem perto demais uns dos outros na tela.
 *
 * Existe por um caso concreto do catálogo: Juazeiro e Petrolina ficam a 0,03°
 * de distância — são cidades vizinhas separadas pelo Rio São Francisco. No
 * zoom inicial do mapa os dois pinos ocupam o mesmo ponto, e um esconde o
 * outro. Agrupados, viram um pino só com a soma; ao aproximar, a distância em
 * pixels cresce e eles se separam sozinhos.
 *
 * É feito à mão em vez de `leaflet.markercluster` porque são doze praças: a
 * biblioteca custaria mais que o problema.
 */

export interface PontoNaTela {
  x: number;
  y: number;
}

export interface Grupo<T> {
  /** Centro do grupo — a média dos pontos que ele representa. */
  x: number;
  y: number;
  itens: T[];
}

/**
 * O primeiro item vira semente do grupo e os seguintes entram no primeiro
 * grupo que os alcança. A ordem da lista, portanto, decide o desenho — o que
 * é aceitável aqui porque a lista de praças é estável entre renderizações.
 */
export function agruparPorProximidade<T>(
  itens: T[],
  posicaoDe: (item: T) => PontoNaTela,
  raioEmPixels: number,
): Grupo<T>[] {
  const grupos: Grupo<T>[] = [];

  for (const item of itens) {
    const ponto = posicaoDe(item);

    const alcancado = grupos.find(
      (grupo) => Math.hypot(grupo.x - ponto.x, grupo.y - ponto.y) < raioEmPixels,
    );

    if (!alcancado) {
      grupos.push({ x: ponto.x, y: ponto.y, itens: [item] });
      continue;
    }

    // Média corrida: o grupo desliza para o meio do que ele já contém.
    const quantidade = alcancado.itens.length;
    alcancado.x = (alcancado.x * quantidade + ponto.x) / (quantidade + 1);
    alcancado.y = (alcancado.y * quantidade + ponto.y) / (quantidade + 1);
    alcancado.itens.push(item);
  }

  return grupos;
}
