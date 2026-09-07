/**
 * Praças marcadas no globo. As internacionais são institucionais — o banco só
 * guarda cidades brasileiras, então elas não vêm da API de propósito.
 */
export interface Praca {
  nome: string;
  pais: string;
  imoveis: number;
  /**
   * Id da cidade no catálogo, quando a praça é uma delas. As internacionais
   * são institucionais e não têm — é o que distingue uma praça clicável, que
   * leva ao catálogo filtrado, de uma que só marca presença no mapa.
   */
  cidadeId?: number;
  /**
   * Foto da cidade para o card. Enquanto não houver, o card cai no degradê —
   * parear com foto de imóvel colocaria uma casa de Aracaju em Lisboa.
   */
  imagem?: string;
  /** [latitude, longitude] */
  coordenada: [number, number];
}

/**
 * Coordenadas das cidades brasileiras do catálogo, para marcar no globo.
 * A contagem e a foto de cada uma vêm do banco — o que está aqui é só a
 * posição no mapa, que a API não guarda.
 */
export const COORDENADA_POR_CIDADE: Record<string, [number, number]> = {
  "Paulo Afonso": [-9.4, -38.2],
  Salvador: [-12.97, -38.5],
  "Feira de Santana": [-12.27, -38.97],
  Juazeiro: [-9.42, -40.5],
  Petrolina: [-9.39, -40.5],
  Aracaju: [-10.9, -37.07],
  Recife: [-8.05, -34.9],
  Maceió: [-9.67, -35.74],
  Ilhéus: [-14.79, -39.05],
  "Porto Seguro": [-16.44, -39.06],
  "Vitória da Conquista": [-14.86, -40.84],
  Barreiras: [-12.15, -44.99],
};

/**
 * Praças fora do Brasil. São institucionais e fictícias: o banco só guarda
 * cidades brasileiras, então elas não têm imóvel nem foto de verdade.
 */
export const PRACAS_INTERNACIONAIS: Praca[] = [
  {
    nome: "Lisboa",
    pais: "Portugal",
    imoveis: 18,
    coordenada: [38.72, -9.14],
  },
  {
    nome: "Miami",
    pais: "Estados Unidos",
    imoveis: 7,
    coordenada: [25.76, -80.19],
  },
];

export const PRACAS: Praca[] = PRACAS_INTERNACIONAIS;

export const TOTAL_DE_IMOVEIS = PRACAS.reduce((soma, praca) => soma + praca.imoveis, 0);

export const TOTAL_DE_CIDADES = Object.keys(COORDENADA_POR_CIDADE).length;

/** Números institucionais da vitrine — não vêm da API. */
export const AVALIACAO_MEDIA = "4,9";
export const ANOS_DE_MERCADO = 12;
