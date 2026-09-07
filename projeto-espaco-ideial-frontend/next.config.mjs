/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Vinte das fotos do catálogo são locais, em public/imoveis. As outras oito
    // vêm do Unsplash, como no seed original.
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};

export default nextConfig;
