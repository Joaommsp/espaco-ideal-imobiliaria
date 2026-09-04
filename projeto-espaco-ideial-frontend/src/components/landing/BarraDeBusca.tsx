"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Botao } from "@/components/ui/Botao";
import { MenuDeOpcoes } from "@/components/ui/MenuDeOpcoes";
import { Segmentado } from "@/components/ui/Segmentado";
import type { Imovel, Opcao } from "@/lib/types/imovel";

interface BarraDeBuscaProps {
  cidades: Opcao[];
  categorias: Opcao[];
  transacoes: Opcao[];
  /** Usado só para contar quantos imóveis existem por cidade. */
  imoveis: Imovel[];
}

const QUARTOS = [1, 2, 3, 4];
const VAGAS = [0, 1, 2, 3];

/** Ícone por tipo de imóvel — o menu nativo não aceitava nenhum. */
const ICONE_POR_CATEGORIA: Record<string, string> = {
  Casa: "🏠",
  Apartamento: "🏢",
  Terreno: "🌱",
  "Sala Comercial": "🏬",
  Galpão: "🏭",
  "Casa de Praia": "🏖",
  Cobertura: "🌆",
  Chácara: "🌳",
};

export function BarraDeBusca({ cidades, categorias, transacoes, imoveis }: BarraDeBuscaProps) {
  const router = useRouter();

  // Sem lista não há id válido: chutar 1 levaria a uma busca por filtro inventado.
  const semOpcoes = transacoes.length === 0 || cidades.length === 0 || categorias.length === 0;

  const [transacao, setTransacao] = useState<number | string>(transacoes[0]?.id ?? 0);
  const [cidade, setCidade] = useState<number | string>(cidades[0]?.id ?? 0);
  const [categoria, setCategoria] = useState<number | string>(categorias[0]?.id ?? 0);
  const [quartos, setQuartos] = useState<number | string>(2);
  const [vagas, setVagas] = useState<number | string>(1);

  function contarNaCidade(idDaCidade: number): string {
    const total = imoveis.filter((imovel) => imovel.cityId === idDaCidade).length;
    return total > 0 ? String(total) : "";
  }

  return (
    <form
      className="mx-auto mt-7 flex w-full max-w-[1020px] flex-wrap items-end justify-center gap-2.5 rounded-2xl bg-white/75 p-3 shadow-[0_12px_32px_rgba(15,19,23,0.24),inset_0_0_0_1px_rgba(255,255,255,0.55)] backdrop-blur-xl backdrop-saturate-150"
      onSubmit={(evento) => {
        evento.preventDefault();
        if (semOpcoes) {
          return;
        }
        router.push(`/search/properties/${transacao}/${cidade}/${categoria}/${quartos}/${vagas}`);
      }}
    >
      <Segmentado
        rotulo="Negócio"
        valor={transacao}
        aoEscolher={setTransacao}
        opcoes={transacoes.map((opcao) => ({ valor: opcao.id, rotulo: opcao.nome }))}
      />

      <MenuDeOpcoes
        rotulo="Cidade"
        valor={cidade}
        aoEscolher={setCidade}
        desabilitado={semOpcoes}
        opcoes={cidades.map((opcao) => ({
          valor: opcao.id,
          rotulo: opcao.nome,
          detalhe: contarNaCidade(opcao.id),
        }))}
      />

      <MenuDeOpcoes
        rotulo="Tipo"
        valor={categoria}
        aoEscolher={setCategoria}
        desabilitado={semOpcoes}
        opcoes={categorias.map((opcao) => ({
          valor: opcao.id,
          rotulo: opcao.nome,
          icone: ICONE_POR_CATEGORIA[opcao.nome],
        }))}
      />

      <Segmentado
        rotulo="Quartos"
        valor={quartos}
        aoEscolher={setQuartos}
        opcoes={QUARTOS.map((valor) => ({ valor, rotulo: String(valor) }))}
      />

      <Segmentado
        rotulo="Vagas"
        valor={vagas}
        aoEscolher={setVagas}
        opcoes={VAGAS.map((valor) => ({ valor, rotulo: String(valor) }))}
      />

      <Botao
        type="submit"
        tamanho="grande"
        disabled={semOpcoes}
        className="self-end rounded-[9px] sm:ml-auto"
      >
        {semOpcoes ? "Indisponível" : "Buscar"}
      </Botao>
    </form>
  );
}
