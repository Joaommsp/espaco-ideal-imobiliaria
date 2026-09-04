import type { Config } from "tailwindcss";

/**
 * Identidade do redesign: grafite carrega o peso, areia dá o descanso que faz
 * a foto do imóvel brilhar e o laranja da marca fica reservado para ação e
 * para o que está à venda. Trocar os valores aqui retematiza o site inteiro.
 */
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "intro-pattern": "url('../../public/images/intro-bg.png')",
        "register-pattern": "url('../../public/images/register-bg.png')",
        "home-pattern": "url('../../public/images/home-bg-banner.png')",
        "admin-pattern": "url('../../public/images/admin-login-bg.png')",
      },
      colors: {
        grafite: {
          DEFAULT: "#0F1317",
          claro: "#1A2026",
          suave: "#2B343D",
        },
        areia: {
          DEFAULT: "#F7F5F1",
          escura: "#EDEAE3",
          linha: "#DDD8CF",
        },
        tinta: {
          DEFAULT: "#141A1F",
          suave: "#4A555F",
          fraca: "#7A8792",
        },
        laranja: {
          DEFAULT: "#F25C26",
          escuro: "#D14711",
          fraco: "#FDEEE7",
        },
        verde: "#2F6B4F",

        // Mantidos: telas ainda não redesenhadas continuam usando estes nomes.
        "orange-primary": "#F46530",
        "orange-secondary": "#FA9C79",
        "custom-black": "#141414",
        "custom-gray-strong": "#4B4B4B",
        "custom-gray-light": "#616161",
        "custom-white": "#E9EBF8",
        "white-secondary": "#F5F6F7",
      },
      fontFamily: {
        display: ["var(--fonte-display)", "Georgia", "serif"],
        corpo: ["var(--fonte-corpo)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        cartao: "14px",
      },
      boxShadow: {
        cartao: "0 18px 38px rgba(15, 19, 23, 0.12)",
        flutuante: "0 20px 44px rgba(0, 0, 0, 0.34)",
      },
      keyframes: {
        surgir: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "none" },
        },
        // Traço do spinner do macOS: acende e desvanece ao longo da volta.
        apagar: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0.15" },
        },
        menu: {
          from: { opacity: "0", transform: "scale(0.96) translateY(-4px)" },
          to: { opacity: "1", transform: "none" },
        },
      },
      animation: {
        surgir: "surgir 320ms cubic-bezier(0.23, 1, 0.32, 1)",
        apagar: "apagar 800ms linear infinite",
        menu: "menu 180ms cubic-bezier(0.32, 0.72, 0, 1)",
      },
      transitionTimingFunction: {
        mola: "cubic-bezier(0.32, 0.72, 0, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
