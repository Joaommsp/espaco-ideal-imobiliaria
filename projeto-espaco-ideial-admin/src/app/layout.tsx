import type { Metadata } from "next";
import { Archivo, Fraunces } from "next/font/google";

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
    default: "Painel · Espaço Ideal Imobiliária",
    template: "%s · Painel Espaço Ideal",
  },
  description: "Administração de imóveis, agendamentos e usuários da Espaço Ideal.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" className={`${display.variable} ${corpo.variable}`}>
      <body className="bg-areia font-corpo text-tinta antialiased">{children}</body>
    </html>
  );
}
