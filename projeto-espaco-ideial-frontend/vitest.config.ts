import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/**
 * Os testes cobrem o catálogo e as funções puras que as telas usam — dado e
 * regra, sem DOM. Por isso o ambiente é `node`: montar jsdom para isto seria
 * peso sem contrapartida.
 *
 * O alias repete o `paths` do tsconfig. É uma linha contra uma dependência a
 * mais só para lê-lo.
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
