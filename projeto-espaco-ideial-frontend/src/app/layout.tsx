import type { Metadata } from "next";
import { Archivo, Fraunces } from "next/font/google";

import { RolarParaOTopo } from "@/components/ui/RolarParaOTopo";

import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--fonte-display",
  display: "swap",
});

const corpo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--fonte-corpo",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Espaço Ideal Imobiliária — casas, apartamentos e salas comerciais",
    template: "%s · Espaço Ideal",
  },
  description:
    "Compra e locação de imóveis em Paulo Afonso, Salvador, Aracaju e mais três cidades. Casas, apartamentos, terrenos e salas comerciais com atendimento local.",
  keywords: [
    "imobiliária",
    "imóveis Paulo Afonso",
    "casas à venda",
    "apartamentos para alugar",
    "Espaço Ideal",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className={`${display.variable} ${corpo.variable}`}>
      <body className="bg-areia font-corpo text-tinta antialiased">
        <RolarParaOTopo />
        {children}
      </body>
    </html>
  );
}
