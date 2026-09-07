import type { MetadataRoute } from "next";

/**
 * O manifesto que veio junto do favicon tinha nome vazio e tudo branco. Este
 * é gerado pelo Next, então o nome acompanha o do site e as cores saem do
 * design system: grafite na barra do navegador, como o hero, e areia na tela
 * de abertura, como o corpo da página.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Espaço Ideal Imobiliária",
    short_name: "Espaço Ideal",
    description:
      "Compra e locação de imóveis em doze praças, com corretor que conhece o bairro.",
    start_url: "/",
    display: "standalone",
    lang: "pt-BR",
    theme_color: "#0F1317",
    background_color: "#F7F5F1",
    icons: [
      { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
