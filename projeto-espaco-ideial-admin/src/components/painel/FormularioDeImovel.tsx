"use client";

import Image from "next/image";
import { IconX } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { Botao } from "@/components/ui/Botao";
import { Carregando } from "@/components/ui/Carregando";
import { CampoDeTexto } from "@/components/ui/CampoDeTexto";
import { atualizarImovel, criarImovel, type DadosDoImovel } from "@/lib/services/api";
import type { Imovel, Opcao } from "@/lib/types/imovel";
import { formatarBRL } from "@/lib/utils/formatters";
import { urlDaFoto } from "@/lib/utils/foto";

interface FormularioDeImovelProps {
  imovel: Imovel | null;
  cidades: Opcao[];
  categorias: Opcao[];
  transacoes: Opcao[];
  aoFechar: () => void;
  aoSalvar: () => void;
}

const VAZIO = {
  registro: "",
  endereco: "",
  descricao: "",
  qtdQuartos: "0",
  qtdVagasGaragem: "0",
  area: "0",
  preco: "0",
  urlImagem: "",
};

/** Só dígitos: o campo aceita o que a pessoa digitar e a máscara reconstrói. */
function apenasNumeros(texto: string): string {
  return texto.replace(/\D/g, "");
}

function precoEmCentavos(valor: number): string {
  return String(Math.round(valor * 100));
}

function centavosParaNumero(centavos: string): number {
  return Number(centavos || 0) / 100;
}

/**
 * Formulário em painel lateral: a lista continua atrás, então dá para conferir
 * a linha enquanto edita.
 */
export function FormularioDeImovel({
  imovel,
  cidades,
  categorias,
  transacoes,
  aoFechar,
  aoSalvar,
}: FormularioDeImovelProps) {
  const painel = useRef<HTMLDivElement>(null);
  const [campos, setCampos] = useState(VAZIO);
  const [centavos, setCentavos] = useState("0");
  const [cidade, setCidade] = useState(cidades[0]?.id ?? 0);
  const [categoria, setCategoria] = useState(categorias[0]?.id ?? 0);
  const [transacao, setTransacao] = useState(transacoes[0]?.id ?? 0);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (imovel) {
      setCampos({
        registro: imovel.registro,
        endereco: imovel.endereco,
        descricao: imovel.descricao,
        qtdQuartos: String(imovel.qtdQuartos),
        qtdVagasGaragem: String(imovel.qtdVagasGaragem),
        area: String(imovel.area),
        preco: String(imovel.preco),
        urlImagem: imovel.urlImagem,
      });
      setCentavos(precoEmCentavos(imovel.preco));
      setCidade(imovel.cityId);
      setCategoria(imovel.categoryId);
      setTransacao(imovel.transacaoId);
    } else {
      setCampos(VAZIO);
      setCentavos("0");
    }
    setErro("");
  }, [imovel]);

  useEffect(() => {
    painel.current?.focus();

    function aoTeclar(evento: KeyboardEvent) {
      if (evento.key === "Escape") {
        aoFechar();
      }
    }

    document.addEventListener("keydown", aoTeclar);
    return () => document.removeEventListener("keydown", aoTeclar);
  }, [aoFechar]);

  function mudar(campo: keyof typeof VAZIO, valor: string) {
    setCampos((atuais) => ({ ...atuais, [campo]: valor }));
  }

  async function salvar() {
    if (!campos.registro.trim() || !campos.endereco.trim()) {
      setErro("Referência e endereço são obrigatórios.");
      return;
    }

    setSalvando(true);
    setErro("");

    const dados: DadosDoImovel = {
      registro: campos.registro.trim(),
      endereco: campos.endereco.trim(),
      descricao: campos.descricao.trim(),
      qtdQuartos: Number(campos.qtdQuartos) || 0,
      qtdVagasGaragem: Number(campos.qtdVagasGaragem) || 0,
      area: Number(campos.area) || 0,
      preco: centavosParaNumero(centavos),
      urlImagem: campos.urlImagem.trim(),
      cityId: Number(cidade),
      categoryId: Number(categoria),
      transacaoId: Number(transacao),
    };

    try {
      if (imovel) {
        await atualizarImovel(imovel.id, dados);
      } else {
        await criarImovel(dados);
      }
      aoSalvar();
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : "Não foi possível salvar.");
      setSalvando(false);
    }
  }

  return (
    <>
      <div aria-hidden onClick={aoFechar} className="fixed inset-0 z-40 bg-grafite/40" />

      <div
        ref={painel}
        role="dialog"
        aria-modal="true"
        aria-label={imovel ? "Editar imóvel" : "Novo imóvel"}
        tabIndex={-1}
        className="fixed right-0 top-0 z-50 flex h-dvh w-[min(28rem,92vw)] flex-col bg-white shadow-[-14px_0_40px_rgba(15,19,23,0.24)] focus:outline-none"
      >
        <header className="flex items-center justify-between gap-3 border-b border-areia-linha px-5 py-4">
          <div>
            <h2 className="font-display text-xl">{imovel ? "Editar imóvel" : "Novo imóvel"}</h2>
            {imovel ? (
              <p className="mt-0.5 text-[0.75rem] text-tinta-fraca">Referência {imovel.registro}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={aoFechar}
            aria-label="Fechar"
            className="grid size-9 cursor-pointer place-items-center rounded-lg text-tinta-fraca transition-colors hover:bg-areia-escura hover:text-tinta"
          >
            <IconX size={18} stroke={1.8} />
          </button>
        </header>

        <form
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={(evento) => {
            evento.preventDefault();
            void salvar();
          }}
        >
          <div className="grid flex-1 gap-3.5 overflow-y-auto p-5">
            {campos.urlImagem ? (
              <div className="flex items-center gap-3 rounded-[9px] bg-areia p-2.5">
                <Image
                  src={urlDaFoto(campos.urlImagem)}
                  alt=""
                  width={64}
                  height={48}
                  className="h-12 w-16 shrink-0 rounded-md object-cover"
                />
                <div className="min-w-0">
                  <b className="block text-[0.82rem]">Foto atual</b>
                  <small className="block truncate text-[0.74rem] text-tinta-fraca">
                    {campos.urlImagem}
                  </small>
                </div>
              </div>
            ) : null}

            <CampoDeTexto
              rotulo="Endereço"
              value={campos.endereco}
              onChange={(evento) => mudar("endereco", evento.target.value)}
              placeholder="Rua, número — bairro, cidade"
            />

            <div className="grid grid-cols-2 gap-3">
              <CampoDeTexto
                rotulo="Referência"
                value={campos.registro}
                onChange={(evento) => mudar("registro", evento.target.value)}
                placeholder="EI-1000"
              />
              <CampoDeTexto
                rotulo="Preço"
                inputMode="numeric"
                value={formatarBRL(centavosParaNumero(centavos))}
                onChange={(evento) => setCentavos(apenasNumeros(evento.target.value))}
                dica="Digite só os números"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Selecao rotulo="Cidade" valor={cidade} opcoes={cidades} aoMudar={setCidade} />
              <Selecao rotulo="Tipo" valor={categoria} opcoes={categorias} aoMudar={setCategoria} />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <CampoDeTexto
                rotulo="Quartos"
                inputMode="numeric"
                value={campos.qtdQuartos}
                onChange={(evento) => mudar("qtdQuartos", apenasNumeros(evento.target.value))}
              />
              <CampoDeTexto
                rotulo="Vagas"
                inputMode="numeric"
                value={campos.qtdVagasGaragem}
                onChange={(evento) => mudar("qtdVagasGaragem", apenasNumeros(evento.target.value))}
              />
              <CampoDeTexto
                rotulo="Área m²"
                inputMode="numeric"
                value={campos.area}
                onChange={(evento) => mudar("area", apenasNumeros(evento.target.value))}
              />
            </div>

            <Selecao rotulo="Negócio" valor={transacao} opcoes={transacoes} aoMudar={setTransacao} />

            <CampoDeTexto
              rotulo="Foto (URL)"
              value={campos.urlImagem}
              onChange={(evento) => mudar("urlImagem", evento.target.value)}
              placeholder="/imoveis/EI-1000.webp"
            />

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="descricao-do-imovel"
                className="text-[0.72rem] font-bold uppercase tracking-[0.1em] text-tinta-fraca"
              >
                Descrição
              </label>
              <textarea
                id="descricao-do-imovel"
                value={campos.descricao}
                onChange={(evento) => mudar("descricao", evento.target.value)}
                className="min-h-24 resize-y rounded-[9px] border-0 bg-white px-3.5 py-3 text-[0.95rem] shadow-[0_0_0_1px_rgba(15,19,23,0.1)] outline-none focus:shadow-[0_0_0_3px_rgba(10,132,255,0.35),0_0_0_1px_#0A84FF]"
              />
              <p className="text-[0.74rem] text-tinta-fraca">
                A primeira frase vira o título do anúncio no site.
              </p>
            </div>

            {erro ? (
              <p role="alert" className="animate-surgir text-sm font-medium text-laranja-escuro">
                {erro}
              </p>
            ) : null}
          </div>

          <footer className="flex justify-end gap-2 border-t border-areia-linha bg-areia px-5 py-4">
            <Botao variante="contorno" onClick={aoFechar} disabled={salvando}>
              Cancelar
            </Botao>
            <Botao type="submit" disabled={salvando}>
              {salvando ? <Carregando rotulo="Salvando" /> : imovel ? "Salvar alterações" : "Cadastrar"}
            </Botao>
          </footer>
        </form>
      </div>
    </>
  );
}

function Selecao({
  rotulo,
  valor,
  opcoes,
  aoMudar,
}: {
  rotulo: string;
  valor: number;
  opcoes: Opcao[];
  aoMudar: (valor: number) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[0.72rem] font-bold uppercase tracking-[0.1em] text-tinta-fraca">
        {rotulo}
      </span>
      <select
        value={valor}
        onChange={(evento) => aoMudar(Number(evento.target.value))}
        className="cursor-pointer rounded-[9px] border-0 bg-white px-3 py-3 text-[0.95rem] text-tinta shadow-[0_0_0_1px_rgba(15,19,23,0.1)] outline-none focus:shadow-[0_0_0_3px_rgba(10,132,255,0.35),0_0_0_1px_#0A84FF]"
      >
        {opcoes.map((opcao) => (
          <option key={opcao.id} value={opcao.id}>
            {opcao.nome}
          </option>
        ))}
      </select>
    </label>
  );
}
