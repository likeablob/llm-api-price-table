import path from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";
import { mergeConfig } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
  ],
  framework: "@storybook/react-vite",
  core: {
    disableTelemetry: true,
  },
  async viteFinal(viteConfig) {
    return mergeConfig(viteConfig, {
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "../src"),
        },
      },
      plugins: [tailwindcss()],
    });
  },
};
export default config;
