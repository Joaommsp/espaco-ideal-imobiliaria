/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      // O site serve as fotos dos imóveis; "frontend" é o nome do serviço na
      // rede do Docker, "localhost" cobre quem roda o painel fora do container.
      { protocol: "http", hostname: "frontend" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
};

export default nextConfig;
