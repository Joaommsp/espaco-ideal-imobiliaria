import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

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
        "orange-primary": "#F46530",
        "orange-secondary": "#FA9C79",
        "custom-black": "#141414",
        "custom-gray-strong": "#4B4B4B",
        "custom-gray-light": "#616161",
        "custom-white": "#E9EBF8",
        "white-secondary": "#F5F6F7",
      },
    },
  },
  plugins: [forms],
};

export default config;
