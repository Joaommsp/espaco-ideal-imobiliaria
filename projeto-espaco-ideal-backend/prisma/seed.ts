import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Catálogo mínimo para o site funcionar: sem cidade, categoria e transação
 * cadastradas, os filtros da busca ficam vazios e nenhuma propriedade pode
 * ser criada. Roda a cada subida e é idempotente.
 */
const CIDADES = [
  'Paulo Afonso',
  'Salvador',
  'Feira de Santana',
  'Juazeiro',
  'Petrolina',
  'Aracaju',
  'Recife',
  'Maceió',
  'Ilhéus',
  'Porto Seguro',
  'Vitória da Conquista',
  'Barreiras',
];

const CATEGORIAS = [
  'Casa',
  'Apartamento',
  'Terreno',
  'Sala Comercial',
  'Galpão',
  'Casa de Praia',
  'Cobertura',
  'Chácara',
];

const TRANSACOES = ['Venda', 'Locação'];

const PROPRIEDADES = [
  {
    registro: 'EI-1001',
    endereco: 'Rua das Acácias, 120 — Centro, Paulo Afonso',
    qtdQuartos: 3,
    qtdVagasGaragem: 2,
    area: 145,
    preco: 420000,
    descricao:
      'Casa térrea reformada, sala ampla integrada à cozinha, quintal com área gourmet e churrasqueira. Documentação em dia.',
    urlImagem:
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80',
    cidade: 'Paulo Afonso',
    categoria: 'Casa',
    transacao: 'Venda',
  },
  {
    registro: 'EI-1002',
    endereco: 'Av. Beira Rio, 890 — Bahia Nova, Paulo Afonso',
    qtdQuartos: 2,
    qtdVagasGaragem: 1,
    area: 78,
    preco: 1800,
    descricao:
      'Apartamento com vista para o rio, dois quartos com armários embutidos, varanda e portaria 24 horas.',
    urlImagem:
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
    cidade: 'Paulo Afonso',
    categoria: 'Apartamento',
    transacao: 'Locação',
  },
  {
    registro: 'EI-1003',
    endereco: 'Rua do Comércio, 45 — Centro, Salvador',
    qtdQuartos: 0,
    qtdVagasGaragem: 3,
    area: 210,
    preco: 5200,
    descricao:
      'Sala comercial de esquina, pé-direito alto, banheiro adaptado e três vagas cobertas. Ideal para clínica ou escritório.',
    urlImagem:
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
    cidade: 'Salvador',
    categoria: 'Sala Comercial',
    transacao: 'Locação',
  },
  {
    registro: 'EI-1004',
    endereco: 'Alameda dos Ipês, 77 — Horto, Salvador',
    qtdQuartos: 4,
    qtdVagasGaragem: 4,
    area: 320,
    preco: 1250000,
    descricao:
      'Casa em condomínio fechado, quatro suítes, piscina aquecida e paisagismo assinado. Lazer completo no condomínio.',
    urlImagem:
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
    cidade: 'Salvador',
    categoria: 'Casa',
    transacao: 'Venda',
  },
  {
    registro: 'EI-1005',
    endereco: 'Rua Nova, 300 — Cidade Nova, Feira de Santana',
    qtdQuartos: 3,
    qtdVagasGaragem: 2,
    area: 132,
    preco: 2400,
    descricao:
      'Casa em rua tranquila, três quartos sendo uma suíte, cozinha planejada e quintal com varal coberto.',
    urlImagem:
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80',
    cidade: 'Feira de Santana',
    categoria: 'Casa',
    transacao: 'Locação',
  },
  {
    registro: 'EI-1006',
    endereco: 'Loteamento Vale Verde, Quadra 8 — Juazeiro',
    qtdQuartos: 0,
    qtdVagasGaragem: 0,
    area: 450,
    preco: 180000,
    descricao:
      'Terreno plano, murado nos três lados, pronto para construir. Água e energia na porta.',
    urlImagem:
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    cidade: 'Juazeiro',
    categoria: 'Terreno',
    transacao: 'Venda',
  },
  {
    registro: 'EI-1007',
    endereco: 'Av. das Nações, 1500 — Distrito Industrial, Petrolina',
    qtdQuartos: 0,
    qtdVagasGaragem: 6,
    area: 800,
    preco: 12000,
    descricao:
      'Galpão com pé-direito de 8 metros, doca para carga, escritório interno e pátio de manobra.',
    urlImagem:
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    cidade: 'Petrolina',
    categoria: 'Galpão',
    transacao: 'Locação',
  },
  {
    registro: 'EI-1008',
    endereco: 'Rua da Praia, 210 — Atalaia, Aracaju',
    qtdQuartos: 2,
    qtdVagasGaragem: 1,
    area: 92,
    preco: 495000,
    descricao:
      'Apartamento a duas quadras da praia, varanda com churrasqueira, lazer com piscina e academia.',
    urlImagem:
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
    cidade: 'Aracaju',
    categoria: 'Apartamento',
    transacao: 'Venda',
  },
  {
    registro: 'EI-1009',
    endereco: 'Rua do Farol, 88 — Barra, Salvador',
    qtdQuartos: 3,
    qtdVagasGaragem: 2,
    area: 180,
    preco: 890000,
    descricao:
      'Casa de esquina com varanda gourmet, três suítes e vista para o mar da Barra.',
    urlImagem:
      '/imoveis/EI-1009.webp',
    cidade: 'Salvador',
    categoria: 'Casa',
    transacao: 'Venda',
  },
  {
    registro: 'EI-1010',
    endereco: 'Av. Oceânica, 2200 — Ondina, Salvador',
    qtdQuartos: 2,
    qtdVagasGaragem: 1,
    area: 84,
    preco: 3800,
    descricao:
      'Apartamento de frente para o mar, portaria 24h e lazer completo no prédio.',
    urlImagem:
      '/imoveis/EI-1010.webp',
    cidade: 'Salvador',
    categoria: 'Apartamento',
    transacao: 'Locação',
  },
  {
    registro: 'EI-1011',
    endereco: 'Rua das Mangueiras, 45 — Centro, Feira de Santana',
    qtdQuartos: 3,
    qtdVagasGaragem: 2,
    area: 150,
    preco: 395000,
    descricao:
      'Casa reformada em rua arborizada, quintal amplo e garagem coberta para dois carros.',
    urlImagem:
      '/imoveis/EI-1011.webp',
    cidade: 'Feira de Santana',
    categoria: 'Casa',
    transacao: 'Venda',
  },
  {
    registro: 'EI-1012',
    endereco: 'Loteamento Alto do Sol, Q12 — Juazeiro',
    qtdQuartos: 0,
    qtdVagasGaragem: 0,
    area: 600,
    preco: 145000,
    descricao:
      'Terreno em condomínio fechado, plano e murado, pronto para construir.',
    urlImagem:
      '/imoveis/EI-1012.webp',
    cidade: 'Juazeiro',
    categoria: 'Terreno',
    transacao: 'Venda',
  },
  {
    registro: 'EI-1013',
    endereco: 'Rua da Aurora, 310 — Boa Vista, Recife',
    qtdQuartos: 2,
    qtdVagasGaragem: 1,
    area: 72,
    preco: 2900,
    descricao:
      'Apartamento reformado a duas quadras do Rio Capibaribe, com armários planejados.',
    urlImagem:
      '/imoveis/EI-1013.webp',
    cidade: 'Recife',
    categoria: 'Apartamento',
    transacao: 'Locação',
  },
  {
    registro: 'EI-1014',
    endereco: 'Av. Boa Viagem, 4500 — Recife',
    qtdQuartos: 4,
    qtdVagasGaragem: 3,
    area: 210,
    preco: 1450000,
    descricao:
      'Cobertura duplex com terraço, piscina privativa e vista permanente para a praia.',
    urlImagem:
      '/imoveis/EI-1014.webp',
    cidade: 'Recife',
    categoria: 'Cobertura',
    transacao: 'Venda',
  },
  {
    registro: 'EI-1015',
    endereco: 'Rua Jangadeiros, 15 — Ponta Verde, Maceió',
    qtdQuartos: 3,
    qtdVagasGaragem: 2,
    area: 140,
    preco: 780000,
    descricao:
      'Casa de praia a 200 metros da orla, com deck de madeira e churrasqueira.',
    urlImagem:
      '/imoveis/EI-1015.webp',
    cidade: 'Maceió',
    categoria: 'Casa de Praia',
    transacao: 'Venda',
  },
  {
    registro: 'EI-1016',
    endereco: 'Av. Álvaro Otacílio, 3000 — Maceió',
    qtdQuartos: 2,
    qtdVagasGaragem: 2,
    area: 95,
    preco: 4200,
    descricao:
      'Apartamento mobiliado com vista lateral para o mar, pronto para morar.',
    urlImagem:
      '/imoveis/EI-1016.webp',
    cidade: 'Maceió',
    categoria: 'Apartamento',
    transacao: 'Locação',
  },
  {
    registro: 'EI-1017',
    endereco: 'Rua do Cacau, 120 — Centro, Ilhéus',
    qtdQuartos: 3,
    qtdVagasGaragem: 1,
    area: 165,
    preco: 420000,
    descricao:
      'Casa colonial restaurada, pé-direito alto e azulejos originais preservados.',
    urlImagem:
      '/imoveis/EI-1017.webp',
    cidade: 'Ilhéus',
    categoria: 'Casa',
    transacao: 'Venda',
  },
  {
    registro: 'EI-1018',
    endereco: 'Estrada do Coco, km 8 — Ilhéus',
    qtdQuartos: 4,
    qtdVagasGaragem: 4,
    area: 3200,
    preco: 1250000,
    descricao:
      'Chácara com pomar formado, casa sede de quatro quartos e nascente própria.',
    urlImagem:
      '/imoveis/EI-1018.webp',
    cidade: 'Ilhéus',
    categoria: 'Chácara',
    transacao: 'Venda',
  },
  {
    registro: 'EI-1019',
    endereco: 'Rua da Passarela, 60 — Centro, Porto Seguro',
    qtdQuartos: 2,
    qtdVagasGaragem: 1,
    area: 68,
    preco: 2600,
    descricao:
      'Apartamento a uma quadra da Passarela do Descobrimento, ideal para temporada.',
    urlImagem:
      '/imoveis/EI-1019.webp',
    cidade: 'Porto Seguro',
    categoria: 'Apartamento',
    transacao: 'Locação',
  },
  {
    registro: 'EI-1020',
    endereco: 'Av. Beira Mar, 900 — Taperapuan, Porto Seguro',
    qtdQuartos: 5,
    qtdVagasGaragem: 3,
    area: 320,
    preco: 1680000,
    descricao:
      'Casa de praia com acesso direto à areia, cinco suítes e piscina aquecida.',
    urlImagem:
      '/imoveis/EI-1020.webp',
    cidade: 'Porto Seguro',
    categoria: 'Casa de Praia',
    transacao: 'Venda',
  },
  {
    registro: 'EI-1021',
    endereco: 'Rua Siqueira Campos, 250 — Centro, Vitória da Conquista',
    qtdQuartos: 3,
    qtdVagasGaragem: 2,
    area: 155,
    preco: 465000,
    descricao:
      'Casa em bairro residencial tranquilo, com edícula e área de serviço coberta.',
    urlImagem:
      '/imoveis/EI-1021.webp',
    cidade: 'Vitória da Conquista',
    categoria: 'Casa',
    transacao: 'Venda',
  },
  {
    registro: 'EI-1022',
    endereco: 'Av. Olívia Flores, 1200 — Vitória da Conquista',
    qtdQuartos: 0,
    qtdVagasGaragem: 4,
    area: 180,
    preco: 6500,
    descricao:
      'Sala comercial em avenida movimentada, com recepção e três ambientes.',
    urlImagem:
      '/imoveis/EI-1022.webp',
    cidade: 'Vitória da Conquista',
    categoria: 'Sala Comercial',
    transacao: 'Locação',
  },
  {
    registro: 'EI-1023',
    endereco: 'Rua do Algodão, 77 — Barreiras',
    qtdQuartos: 3,
    qtdVagasGaragem: 2,
    area: 168,
    preco: 520000,
    descricao:
      'Casa nova em condomínio, acabamento em porcelanato e cozinha planejada.',
    urlImagem:
      '/imoveis/EI-1023.webp',
    cidade: 'Barreiras',
    categoria: 'Casa',
    transacao: 'Venda',
  },
  {
    registro: 'EI-1024',
    endereco: 'Distrito Industrial, Lote 14 — Barreiras',
    qtdQuartos: 0,
    qtdVagasGaragem: 8,
    area: 1400,
    preco: 18000,
    descricao:
      'Galpão logístico com doca elevada, pátio de manobra e escritório interno.',
    urlImagem:
      '/imoveis/EI-1024.webp',
    cidade: 'Barreiras',
    categoria: 'Galpão',
    transacao: 'Locação',
  },
  {
    registro: 'EI-1025',
    endereco: 'Rua das Palmeiras, 402 — Centro, Paulo Afonso',
    qtdQuartos: 2,
    qtdVagasGaragem: 1,
    area: 88,
    preco: 285000,
    descricao:
      'Apartamento térreo com quintal privativo, dois quartos e vaga coberta.',
    urlImagem:
      '/imoveis/EI-1025.webp',
    cidade: 'Paulo Afonso',
    categoria: 'Apartamento',
    transacao: 'Venda',
  },
  {
    registro: 'EI-1026',
    endereco: 'Av. Landulfo Alves, 750 — Bahia Nova, Paulo Afonso',
    qtdQuartos: 4,
    qtdVagasGaragem: 3,
    area: 240,
    preco: 720000,
    descricao:
      'Casa ampla com suíte máster, escritório e área gourmet integrada à piscina.',
    urlImagem:
      '/imoveis/EI-1026.webp',
    cidade: 'Paulo Afonso',
    categoria: 'Casa',
    transacao: 'Venda',
  },
  {
    registro: 'EI-1027',
    endereco: 'Rua Santo Antônio, 33 — Centro, Aracaju',
    qtdQuartos: 1,
    qtdVagasGaragem: 1,
    area: 52,
    preco: 1650,
    descricao:
      'Kitnet reformada no centro, perto de tudo, com armários e ar-condicionado.',
    urlImagem:
      '/imoveis/EI-1027.webp',
    cidade: 'Aracaju',
    categoria: 'Apartamento',
    transacao: 'Locação',
  },
  {
    registro: 'EI-1028',
    endereco: 'Av. Beira Mar, 1800 — Atalaia, Aracaju',
    qtdQuartos: 3,
    qtdVagasGaragem: 2,
    area: 175,
    preco: 960000,
    descricao:
      'Cobertura com vista para o mar, terraço com churrasqueira e duas vagas.',
    urlImagem:
      '/imoveis/EI-1028.webp',
    cidade: 'Aracaju',
    categoria: 'Cobertura',
    transacao: 'Venda',
  },
];

async function main() {
  for (const nomeCidade of CIDADES) {
    const existente = await prisma.city.findFirst({ where: { nomeCidade } });
    if (!existente) {
      await prisma.city.create({ data: { nomeCidade } });
    }
  }

  for (const nomeCategoria of CATEGORIAS) {
    const existente = await prisma.category.findFirst({ where: { nomeCategoria } });
    if (!existente) {
      await prisma.category.create({ data: { nomeCategoria } });
    }
  }

  for (const nomeTransacao of TRANSACOES) {
    const existente = await prisma.transacao.findFirst({ where: { nomeTransacao } });
    if (!existente) {
      await prisma.transacao.create({ data: { nomeTransacao } });
    }
  }

  for (const item of PROPRIEDADES) {
    const jaExiste = await prisma.property.findFirst({
      where: { registro: item.registro },
    });

    if (jaExiste) {
      // Idempotente, mas não cego: se a foto do catálogo mudou, atualiza.
      if (jaExiste.urlImagem !== item.urlImagem) {
        await prisma.property.update({
          where: { id: jaExiste.id },
          data: { urlImagem: item.urlImagem },
        });
      }
      continue;
    }

    const cidade = await prisma.city.findFirst({ where: { nomeCidade: item.cidade } });
    const categoria = await prisma.category.findFirst({
      where: { nomeCategoria: item.categoria },
    });
    const transacao = await prisma.transacao.findFirst({
      where: { nomeTransacao: item.transacao },
    });

    if (!cidade || !categoria || !transacao) {
      throw new Error(`Catálogo incompleto para a propriedade ${item.registro}.`);
    }

    await prisma.property.create({
      data: {
        registro: item.registro,
        endereco: item.endereco,
        qtdQuartos: item.qtdQuartos,
        qtdVagasGaragem: item.qtdVagasGaragem,
        area: item.area,
        preco: item.preco,
        descricao: item.descricao,
        urlImagem: item.urlImagem,
        cityId: cidade.id,
        categoryId: categoria.id,
        transacaoId: transacao.id,
      },
    });
  }

  const totais = {
    cidades: await prisma.city.count(),
    categorias: await prisma.category.count(),
    transacoes: await prisma.transacao.count(),
    propriedades: await prisma.property.count(),
  };
  console.log('Seed concluído:', totais);
}

main()
  .catch((erro) => {
    console.error(erro);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
