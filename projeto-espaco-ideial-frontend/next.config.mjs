/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // As fotos dos imóveis são URLs externas: o Storage do Firebase para o que
    // o painel envia, e o Unsplash para os imóveis de exemplo do seed.
    remotePatterns: [
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
