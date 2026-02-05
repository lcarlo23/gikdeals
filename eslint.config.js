import js from "@eslint/js";
import globals from "globals";
import css from "@eslint/css";
import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier";

export default defineConfig([
  { ignores: ["dist/**", "node_modules/**"] },
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ["**/*.css"],
    plugins: { css },
    language: "css/css",
    extends: ["css/recommended"],
    rules: {
      "css/no-invalid-properties": ["error", { allowUnknownVariables: true }],
      "css/use-baseline": ["error", { available: "newly" }],
    },
  },
  eslintConfigPrettier,
]);
