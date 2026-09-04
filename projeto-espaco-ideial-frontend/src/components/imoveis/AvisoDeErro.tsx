import { Botao } from "@/components/ui/Botao";

/**
 * Erro fiel ao que aconteceu: antes o catch só escrevia no console e a tela
 * ficava em branco, sem o usuário saber se era falha ou lista vazia.
 */
export function AvisoDeErro({
  mensagem,
  titulo = "Não conseguimos carregar os imóveis",
  aoTentarNovamente,
}: {
  mensagem: string;
  titulo?: string;
  aoTentarNovamente?: () => void;
}) {
  return (
    <div
      role="alert"
      className="rounded-cartao border border-laranja/30 bg-laranja-fraco px-6 py-10 text-center"
    >
      <h2 className="font-display text-xl text-tinta">{titulo}</h2>
      <p className="mx-auto mt-2 max-w-[52ch] text-sm text-tinta-suave">{mensagem}</p>
      {aoTentarNovamente ? (
        <Botao className="mt-6" onClick={aoTentarNovamente}>
          Tentar novamente
        </Botao>
      ) : null}
    </div>
  );
}
