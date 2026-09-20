import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
// NOTE: astro:content 의 z 는 Astro 8 에서 빠진다. astro/zod 에서 직접 가져온다
import { z } from "astro/zod";

const posts = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/posts",
    /* NOTE 기본 generateId는 슬러그화하며 소문자로 바꾸므로 직접 만든다
     * - /Algorithm-Baekjoon-24479/ 처럼 대문자가 섞인 URL이 실재한다 [URL 보존]
     * - 파일명 공백 1건은 제거해 Jekyll과 같은 /PS-03-.../ 를 만든다 [URL 보존]
     */
    generateId: ({ entry }) => entry.replace(/\.md$/, "").replace(/\s+/g, ""),
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    categories: z.array(z.string()).min(1),
    tags: z.array(z.string()).default([]),
    // NOTE: 수식 제어용이 아니라 KaTeX CSS 조건부 로드용 [수식 전역 적용]
    use_math: z.boolean().default(false),
    // NOTE: 대표 이미지. 적은 글에만 붙는다. 본문 이미지를 자동으로 쓰지 않는다 [대표 이미지]
    thumbnail: z.string().optional(),
    summary: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
