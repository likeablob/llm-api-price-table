import eslint from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import astroParser from "astro-eslint-parser";
import astroPlugin from "eslint-plugin-astro";
import globals from "globals";

export default [
  eslint.configs.recommended,
  {
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      astro: astroPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...astroPlugin.configs.recommended.rules,
    },
  },
  {
    files: ["**/*.astro"],
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: [".astro"],
      },
    },
  },
];
