import fs from "node:fs";
import path from "node:path";
import { unified } from "@astrojs/markdown-remark";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

/* NOTE Phase 2 임시 플러그인이다. Phase 3에서 이 함수와 vite.plugins 등록을 함께 지운다
 * - 이미지는 Phase 3에서 public/assets/img로 복사한다
 * - 그 전까지 dev 서버에서만 기존 Jekyll assets/img를 서빙해 파일럿을 확인한다
 */
function legacyJekyllImages() {
  const root = path.resolve("assets/img");
  const types = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
  };
  return {
    name: "legacy-jekyll-images",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = (req.url ?? "").split("?")[0];
        if (!url.startsWith("/assets/img/")) return next();
        const file = path.join(root, decodeURIComponent(url.slice("/assets/img/".length)));
        if (!file.startsWith(root + path.sep)) return next();
        if (!fs.existsSync(file) || !fs.statSync(file).isFile()) return next();
        res.setHeader(
          "Content-Type",
          types[path.extname(file).toLowerCase()] ?? "application/octet-stream",
        );
        fs.createReadStream(file).pipe(res);
      });
    },
  };
}

export default defineConfig({
  // NOTE: 이 세 줄이 URL 1:1 보존의 전부다. 바꾸지 말 것 (MIGRATION.md 2-2)
  site: "https://devfancy.github.io",
  trailingSlash: "always",
  build: { format: "directory" },

  integrations: [sitemap()],

  markdown: {
    // NOTE: 수식은 전역 적용된다. 프론트매터로 끌 수 없다 (4-4-1)
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [[rehypeKatex, { throwOnError: false }]],
    }),
  },

  vite: { plugins: [tailwindcss(), legacyJekyllImages()] },
});
