// @ts-check

import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";
import { LOCALES } from "./src/lib/translations.js";

// https://astro.build/config
const env = loadEnv(process.env.NODE_ENV || "production", process.cwd(), "");
const SITE = env.SITE || process.env.SITE || "https://example.com";
const BASE_PATH = env.BASE_PATH || process.env.BASE_PATH || "/";

export default defineConfig({
  site: SITE,
  base: BASE_PATH,
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
