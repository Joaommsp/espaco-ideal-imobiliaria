import { COORDENADA_POR_CIDADE, PRACAS_INTERNACIONAIS, type Praca } from "@/data/atuacao";
import type { Imovel, Opcao } from "@/lib/types/imovel";

/**
 * Monta as praças a partir do catálogo real: contagem e foto saem do banco,
 * e a foto é de um imóvel daquela cidade — parear por índice colocava casa de
 * Aracaju em Lisboa. As internacionais entram depois, sem foto.
 */
export function montarPracas(cidades: Opcao[], imoveis: Imovel[]): Praca[] {
  const brasileiras = cidades
    .map((cidade) => {
      const daCidade = imoveis.filter((imovel) => imovel.cityId === cidade.id);
      const comFoto = daCidade.find((imovel) => Boolean(imovel.urlImagem));

      return {
        nome: cidade.nome,
        pais: "Brasil",
        imoveis: daCidade.length,
        // Levar o id junto evita que quem consome a praça precise refazer a
        // junção por nome só para descobri-lo.
        cidadeId: cidade.id,
        coordenada: COORDENADA_POR_CIDADE[cidade.nome] ?? ([0, 0] as [number, number]),
        imagem: comFoto?.urlImagem,
      } satisfies Praca;
    })
    // Cidade sem imóvel não é praça de atuação — é só um cadastro vazio.
    .filter((praca) => praca.imoveis > 0)
    .sort((a, b) => b.imoveis - a.imoveis);

  return [...brasileiras, ...PRACAS_INTERNACIONAIS];
}
