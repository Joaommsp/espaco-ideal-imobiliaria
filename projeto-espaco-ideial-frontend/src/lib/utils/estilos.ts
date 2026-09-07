/**
 * Classes que se repetem entre componentes. O rótulo maiúsculo pequeno já
 * existia em quatro tamanhos ligeiramente diferentes pelo projeto; um valor
 * só evita que o quinto nasça na próxima tela.
 */
export const MICRO_ROTULO =
  "text-[0.72rem] font-bold uppercase tracking-[0.1em] text-tinta-fraca";

/**
 * A caixa do mapa das praças. Vive aqui porque três lugares precisam dela
 * idêntica — o esqueleto, o espaço reservado antes de carregar e o próprio
 * mapa. Divergindo, a seção salta de altura no momento em que o mapa monta.
 */
export const CAIXA_DO_MAPA =
  "h-[340px] w-full rounded-cartao border border-areia-linha md:h-[430px]";
