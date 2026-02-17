import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: "src/",
  publicDir: "../public",
  envDir: "./",

  appType: "mpa",

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        search: resolve(__dirname, "src/search/index.html"),
        favorites: resolve(__dirname, "src/favorites/index.html"),
        giveaways: resolve(__dirname, "src/giveaways/index.html"),
        deals: resolve(__dirname, "src/deals/index.html"),
      },
    },
  },
});
