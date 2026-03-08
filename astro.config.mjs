// @ts-check

import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";
import { LOCALES } from "./src/lib/translations.js";

// https://astro.build/config
const mode = "production";
const env = loadEnv(mode, process.cwd(), "");

export default defineConfig({
  site: env.SITE || "https://example.com",
  base: env.BASE_PATH || "/",
  integrations: [mdx(), sitemap(), react()],

  i18n: {
    locales: [...LOCALES],
    defaultLocale: "en",
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },

  vite: {
    plugins: [tailwindcss()],
    ssr: {
      external: ["@resvg/resvg-js"],
    },
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
});
