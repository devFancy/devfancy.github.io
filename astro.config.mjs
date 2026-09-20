import { unified } from "@astrojs/markdown-remark";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

export default defineConfig({
  // NOTE: 이 세 줄이 URL 1:1 보존의 전부다. 바꾸지 말 것 (MIGRATION.md 2-2)
  site: "https://devfancy.github.io",
  trailingSlash: "always",
  build: { format: "directory" },

  integrations: [sitemap()],

  markdown: {
    // NOTE: 수식은 전역 적용된다. 프론트매터로 끌 수 없다 [수식 전역 적용]
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [[rehypeKatex, { throwOnError: false }]],
    }),
  },

  vite: { plugins: [tailwindcss()] },
});
