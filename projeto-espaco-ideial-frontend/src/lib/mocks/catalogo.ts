import type { Imovel, Opcao } from "@/lib/types/imovel";

/**
 * O catálogo desta versão de exibição. Os dados são os mesmos do seed do
 * Prisma (`projeto-espaco-ideal-backend/prisma/seed.ts`), transcritos para o
 * bundle porque aqui não há banco nem API para consultar.
 *
 * Dado puro: nada de React, nada de Next. É o que permite testar o catálogo
 * sem subir a aplicação.
 */

const NOMES_DE_CIDADE = [
  "Paulo Afonso",
  "Salvador",
  "Feira de Santana",
  "Juazeiro",
  "Petrolina",
  "Aracaju",
  "Recife",
  "Maceió",
  "Ilhéus",
  "Porto Seguro",
  "Vitória da Conquista",
  "Barreiras",
] as const;

const NOMES_DE_CATEGORIA = [
  "Casa",
  "Apartamento",
  "Terreno",
  "Sala Comercial",
  "Galpão",
  "Casa de Praia",
  "Cobertura",
  "Chácara",
] as const;

const NOMES_DE_TRANSACAO = ["Venda", "Locação"] as const;

/** O imóvel como o seed o descreve: relações por nome, ainda sem id. */
interface ImovelBruto {
  registro: string;
  endereco: string;
  descricao: string;
  qtdQuartos: number;
  qtdVagasGaragem: number;
  area: number;
  preco: number;
  urlImagem: string;
  cidade: string;
  categoria: string;
  transacao: string;
}

const IMOVEIS_BRUTOS: ImovelBruto[] = [
  {
    registro: "EI-1001",
    endereco: "Rua das Acácias, 120 — Centro, Paulo Afonso",
    descricao:
      "Casa térrea reformada, sala ampla integrada à cozinha, quintal com área gourmet e churrasqueira. Documentação em dia.",
    qtdQuartos: 3,
    qtdVagasGaragem: 2,
    area: 145,
    preco: 420000,
    urlImagem: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80",
    cidade: "Paulo Afonso",
    categoria: "Casa",
    transacao: "Venda",
  },
  {
    registro: "EI-1002",
    endereco: "Av. Beira Rio, 890 — Bahia Nova, Paulo Afonso",
    descricao:
      "Apartamento com vista para o rio, dois quartos com armários embutidos, varanda e portaria 24 horas.",
    qtdQuartos: 2,
    qtdVagasGaragem: 1,
    area: 78,
    preco: 1800,
    urlImagem: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    cidade: "Paulo Afonso",
    categoria: "Apartamento",
    transacao: "Locação",
  },
  {
    registro: "EI-1003",
    endereco: "Rua do Comércio, 45 — Centro, Salvador",
    descricao:
      "Sala comercial de esquina, pé-direito alto, banheiro adaptado e três vagas cobertas. Ideal para clínica ou escritório.",
    qtdQuartos: 0,
    qtdVagasGaragem: 3,
    area: 210,
    preco: 5200,
    urlImagem: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    cidade: "Salvador",
    categoria: "Sala Comercial",
    transacao: "Locação",
  },
  {
    registro: "EI-1004",
    endereco: "Alameda dos Ipês, 77 — Horto, Salvador",
    descricao:
      "Casa em condomínio fechado, quatro suítes, piscina aquecida e paisagismo assinado. Lazer completo no condomínio.",
    qtdQuartos: 4,
    qtdVagasGaragem: 4,
    area: 320,
    preco: 1250000,
    urlImagem: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
    cidade: "Salvador",
    categoria: "Casa",
    transacao: "Venda",
  },
  {
    registro: "EI-1005",
    endereco: "Rua Nova, 300 — Cidade Nova, Feira de Santana",
    descricao:
      "Casa em rua tranquila, três quartos sendo uma suíte, cozinha planejada e quintal com varal coberto.",
    qtdQuartos: 3,
    qtdVagasGaragem: 2,
    area: 132,
    preco: 2400,
    urlImagem: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80",
    cidade: "Feira de Santana",
    categoria: "Casa",
    transacao: "Locação",
  },
  {
    registro: "EI-1006",
    endereco: "Loteamento Vale Verde, Quadra 8 — Juazeiro",
    descricao:
      "Terreno plano, murado nos três lados, pronto para construir. Água e energia na porta.",
    qtdQuartos: 0,
    qtdVagasGaragem: 0,
    area: 450,
    preco: 180000,
    urlImagem: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
    cidade: "Juazeiro",
    categoria: "Terreno",
    transacao: "Venda",
  },
  {
    registro: "EI-1007",
    endereco: "Av. das Nações, 1500 — Distrito Industrial, Petrolina",
    descricao:
      "Galpão com pé-direito de 8 metros, doca para carga, escritório interno e pátio de manobra.",
    qtdQuartos: 0,
    qtdVagasGaragem: 6,
    area: 800,
    preco: 12000,
    urlImagem: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    cidade: "Petrolina",
    categoria: "Galpão",
    transacao: "Locação",
  },
  {
    registro: "EI-1008",
    endereco: "Rua da Praia, 210 — Atalaia, Aracaju",
    descricao:
      "Apartamento a duas quadras da praia, varanda com churrasqueira, lazer com piscina e academia.",
    qtdQuartos: 2,
    qtdVagasGaragem: 1,
    area: 92,
    preco: 495000,
    urlImagem: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    cidade: "Aracaju",
    categoria: "Apartamento",
    transacao: "Venda",
  },
  {
    registro: "EI-1009",
    endereco: "Rua do Farol, 88 — Barra, Salvador",
    descricao:
      "Casa de esquina com varanda gourmet, três suítes e vista para o mar da Barra.",
    qtdQuartos: 3,
    qtdVagasGaragem: 2,
    area: 180,
    preco: 890000,
    urlImagem: "/imoveis/EI-1009.webp",
    cidade: "Salvador",
    categoria: "Casa",
    transacao: "Venda",
  },
  {
    registro: "EI-1010",
    endereco: "Av. Oceânica, 2200 — Ondina, Salvador",
    descricao:
      "Apartamento de frente para o mar, portaria 24h e lazer completo no prédio.",
    qtdQuartos: 2,
    qtdVagasGaragem: 1,
    area: 84,
    preco: 3800,
    urlImagem: "/imoveis/EI-1010.webp",
    cidade: "Salvador",
    categoria: "Apartamento",
    transacao: "Locação",
  },
  {
    registro: "EI-1011",
    endereco: "Rua das Mangueiras, 45 — Centro, Feira de Santana",
    descricao:
      "Casa reformada em rua arborizada, quintal amplo e garagem coberta para dois carros.",
    qtdQuartos: 3,
    qtdVagasGaragem: 2,
    area: 150,
    preco: 395000,
    urlImagem: "/imoveis/EI-1011.webp",
    cidade: "Feira de Santana",
    categoria: "Casa",
    transacao: "Venda",
  },
  {
    registro: "EI-1012",
    endereco: "Loteamento Alto do Sol, Q12 — Juazeiro",
    descricao:
      "Terreno em condomínio fechado, plano e murado, pronto para construir.",
    qtdQuartos: 0,
    qtdVagasGaragem: 0,
    area: 600,
    preco: 145000,
    urlImagem: "/imoveis/EI-1012.webp",
    cidade: "Juazeiro",
    categoria: "Terreno",
    transacao: "Venda",
  },
  {
    registro: "EI-1013",
    endereco: "Rua da Aurora, 310 — Boa Vista, Recife",
    descricao:
      "Apartamento reformado a duas quadras do Rio Capibaribe, com armários planejados.",
    qtdQuartos: 2,
    qtdVagasGaragem: 1,
    area: 72,
    preco: 2900,
    urlImagem: "/imoveis/EI-1013.webp",
    cidade: "Recife",
    categoria: "Apartamento",
    transacao: "Locação",
  },
  {
    registro: "EI-1014",
    endereco: "Av. Boa Viagem, 4500 — Recife",
    descricao:
      "Cobertura duplex com terraço, piscina privativa e vista permanente para a praia.",
    qtdQuartos: 4,
    qtdVagasGaragem: 3,
    area: 210,
    preco: 1450000,
    urlImagem: "/imoveis/EI-1014.webp",
    cidade: "Recife",
    categoria: "Cobertura",
    transacao: "Venda",
  },
  {
    registro: "EI-1015",
    endereco: "Rua Jangadeiros, 15 — Ponta Verde, Maceió",
    descricao:
      "Casa de praia a 200 metros da orla, com deck de madeira e churrasqueira.",
    qtdQuartos: 3,
    qtdVagasGaragem: 2,
    area: 140,
    preco: 780000,
    urlImagem: "/imoveis/EI-1015.webp",
    cidade: "Maceió",
    categoria: "Casa de Praia",
    transacao: "Venda",
  },
  {
    registro: "EI-1016",
    endereco: "Av. Álvaro Otacílio, 3000 — Maceió",
    descricao:
      "Apartamento mobiliado com vista lateral para o mar, pronto para morar.",
    qtdQuartos: 2,
    qtdVagasGaragem: 2,
    area: 95,
    preco: 4200,
    urlImagem: "/imoveis/EI-1016.webp",
    cidade: "Maceió",
    categoria: "Apartamento",
    transacao: "Locação",
  },
  {
    registro: "EI-1017",
    endereco: "Rua do Cacau, 120 — Centro, Ilhéus",
    descricao:
      "Casa colonial restaurada, pé-direito alto e azulejos originais preservados.",
    qtdQuartos: 3,
    qtdVagasGaragem: 1,
    area: 165,
    preco: 420000,
    urlImagem: "/imoveis/EI-1017.webp",
    cidade: "Ilhéus",
    categoria: "Casa",
    transacao: "Venda",
  },
  {
    registro: "EI-1018",
    endereco: "Estrada do Coco, km 8 — Ilhéus",
    descricao:
      "Chácara com pomar formado, casa sede de quatro quartos e nascente própria.",
    qtdQuartos: 4,
    qtdVagasGaragem: 4,
    area: 3200,
    preco: 1250000,
    urlImagem: "/imoveis/EI-1018.webp",
    cidade: "Ilhéus",
    categoria: "Chácara",
    transacao: "Venda",
  },
  {
    registro: "EI-1019",
    endereco: "Rua da Passarela, 60 — Centro, Porto Seguro",
    descricao:
      "Apartamento a uma quadra da Passarela do Descobrimento, ideal para temporada.",
    qtdQuartos: 2,
    qtdVagasGaragem: 1,
    area: 68,
    preco: 2600,
    urlImagem: "/imoveis/EI-1019.webp",
    cidade: "Porto Seguro",
    categoria: "Apartamento",
    transacao: "Locação",
  },
  {
    registro: "EI-1020",
    endereco: "Av. Beira Mar, 900 — Taperapuan, Porto Seguro",
    descricao:
      "Casa de praia com acesso direto à areia, cinco suítes e piscina aquecida.",
    qtdQuartos: 5,
    qtdVagasGaragem: 3,
    area: 320,
    preco: 1680000,
    urlImagem: "/imoveis/EI-1020.webp",
    cidade: "Porto Seguro",
    categoria: "Casa de Praia",
    transacao: "Venda",
  },
  {
    registro: "EI-1021",
    endereco: "Rua Siqueira Campos, 250 — Centro, Vitória da Conquista",
    descricao:
      "Casa em bairro residencial tranquilo, com edícula e área de serviço coberta.",
    qtdQuartos: 3,
    qtdVagasGaragem: 2,
    area: 155,
    preco: 465000,
    urlImagem: "/imoveis/EI-1021.webp",
    cidade: "Vitória da Conquista",
    categoria: "Casa",
    transacao: "Venda",
  },
  {
    registro: "EI-1022",
    endereco: "Av. Olívia Flores, 1200 — Vitória da Conquista",
    descricao:
      "Sala comercial em avenida movimentada, com recepção e três ambientes.",
    qtdQuartos: 0,
    qtdVagasGaragem: 4,
    area: 180,
    preco: 6500,
    urlImagem: "/imoveis/EI-1022.webp",
    cidade: "Vitória da Conquista",
    categoria: "Sala Comercial",
    transacao: "Locação",
  },
  {
    registro: "EI-1023",
    endereco: "Rua do Algodão, 77 — Barreiras",
    descricao:
      "Casa nova em condomínio, acabamento em porcelanato e cozinha planejada.",
    qtdQuartos: 3,
    qtdVagasGaragem: 2,
    area: 168,
    preco: 520000,
    urlImagem: "/imoveis/EI-1023.webp",
    cidade: "Barreiras",
    categoria: "Casa",
    transacao: "Venda",
  },
  {
    registro: "EI-1024",
    endereco: "Distrito Industrial, Lote 14 — Barreiras",
    descricao:
      "Galpão logístico com doca elevada, pátio de manobra e escritório interno.",
    qtdQuartos: 0,
    qtdVagasGaragem: 8,
    area: 1400,
    preco: 18000,
    urlImagem: "/imoveis/EI-1024.webp",
    cidade: "Barreiras",
    categoria: "Galpão",
    transacao: "Locação",
  },
  {
    registro: "EI-1025",
    endereco: "Rua das Palmeiras, 402 — Centro, Paulo Afonso",
    descricao:
      "Apartamento térreo com quintal privativo, dois quartos e vaga coberta.",
    qtdQuartos: 2,
    qtdVagasGaragem: 1,
    area: 88,
    preco: 285000,
    urlImagem: "/imoveis/EI-1025.webp",
    cidade: "Paulo Afonso",
    categoria: "Apartamento",
    transacao: "Venda",
  },
  {
    registro: "EI-1026",
    endereco: "Av. Landulfo Alves, 750 — Bahia Nova, Paulo Afonso",
    descricao:
      "Casa ampla com suíte máster, escritório e área gourmet integrada à piscina.",
    qtdQuartos: 4,
    qtdVagasGaragem: 3,
    area: 240,
    preco: 720000,
    urlImagem: "/imoveis/EI-1026.webp",
    cidade: "Paulo Afonso",
    categoria: "Casa",
    transacao: "Venda",
  },
  {
    registro: "EI-1027",
    endereco: "Rua Santo Antônio, 33 — Centro, Aracaju",
    descricao:
      "Kitnet reformada no centro, perto de tudo, com armários e ar-condicionado.",
    qtdQuartos: 1,
    qtdVagasGaragem: 1,
    area: 52,
    preco: 1650,
    urlImagem: "/imoveis/EI-1027.webp",
    cidade: "Aracaju",
    categoria: "Apartamento",
    transacao: "Locação",
  },
  {
    registro: "EI-1028",
    endereco: "Av. Beira Mar, 1800 — Atalaia, Aracaju",
    descricao:
      "Cobertura com vista para o mar, terraço com churrasqueira e duas vagas.",
    qtdQuartos: 3,
    qtdVagasGaragem: 2,
    area: 175,
    preco: 960000,
    urlImagem: "/imoveis/EI-1028.webp",
    cidade: "Aracaju",
    categoria: "Cobertura",
    transacao: "Venda",
  },
];

/**
 * O id é a posição na lista, a partir de 1 — é o que o `autoincrement` do
 * Postgres produzia ao semear nesta ordem. Manter a regra num único lugar
 * garante que `/properties/9` continue abrindo o mesmo imóvel a cada build.
 */
function indexar(nomes: readonly string[]): Opcao[] {
  return nomes.map((nome, posicao) => ({ id: posicao + 1, nome }));
}

export const CIDADES: Opcao[] = indexar(NOMES_DE_CIDADE);
export const CATEGORIAS: Opcao[] = indexar(NOMES_DE_CATEGORIA);
export const TRANSACOES: Opcao[] = indexar(NOMES_DE_TRANSACAO);

/**
 * Um nome fora do catálogo é erro de dado, não caso de uso: falhar aqui, na
 * carga do módulo, mostra o registro culpado — em vez de deixar a tela exibir
 * um imóvel sem cidade e o problema aparecer só na revisão visual.
 */
function idDe(opcoes: Opcao[], nome: string, campo: string, registro: string): number {
  const encontrada = opcoes.find((opcao) => opcao.nome === nome);

  if (!encontrada) {
    throw new Error(`O imóvel ${registro} aponta para ${campo} inexistente: "${nome}".`);
  }

  return encontrada.id;
}

/**
 * As relações vêm resolvidas dentro do imóvel, como o `include` do Prisma
 * devolvia. Sem elas a tela recebe só ids e não consegue escrever "Casa em
 * Salvador" nem distinguir preço de venda de valor de aluguel.
 */
export const IMOVEIS: Imovel[] = IMOVEIS_BRUTOS.map((bruto, posicao) => {
  const cityId = idDe(CIDADES, bruto.cidade, "cidade", bruto.registro);
  const categoryId = idDe(CATEGORIAS, bruto.categoria, "categoria", bruto.registro);
  const transacaoId = idDe(TRANSACOES, bruto.transacao, "transação", bruto.registro);

  return {
    id: posicao + 1,
    registro: bruto.registro,
    endereco: bruto.endereco,
    descricao: bruto.descricao,
    qtdQuartos: bruto.qtdQuartos,
    qtdVagasGaragem: bruto.qtdVagasGaragem,
    area: bruto.area,
    preco: bruto.preco,
    urlImagem: bruto.urlImagem,
    cityId,
    categoryId,
    transacaoId,
    city: { id: cityId, nomeCidade: bruto.cidade },
    category: { id: categoryId, nomeCategoria: bruto.categoria },
    transacao: { id: transacaoId, nomeTransacao: bruto.transacao },
  };
});
