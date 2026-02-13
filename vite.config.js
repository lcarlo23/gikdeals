import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: "src/",
  publicDir: "../public",
  envDir: "./",

  appType: "mpa",

  server: {
    proxy: {
      "^/search": {
        target: "http://localhost:5173",
        rewrite: () => "/pages/search/index.html",
      },
      "^/favorites": {
        target: "http://localhost:5173",
        rewrite: () => "/pages/favorites/index.html",
      },
    },
  },

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        search: resolve(__dirname, "src/pages/search/index.html"),
        favorites: resolve(__dirname, "src/pages/favorites/index.html"),
      },
    },
  },
});
