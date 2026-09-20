import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const posts = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/posts",
    /* NOTE 기본 generateId는 슬러그화하며 소문자로 바꾸므로 직접 만든다
     * - /Algorithm-Baekjoon-24479/ 처럼 대문자가 섞인 URL이 실재한다 (2-2)
     * - 파일명 공백 1건은 제거해 Jekyll과 같은 /PS-03-.../ 를 만든다 (8-3-1)
     */
    generateId: ({ entry }) => entry.replace(/\.md$/, "").replace(/\s+/g, ""),
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    categories: z.array(z.string()).min(1),
    tags: z.array(z.string()).default([]),
    // NOTE: 수식 제어용이 아니라 KaTeX CSS 조건부 로드용 (4-4-1)
    use_math: z.boolean().default(false),
    featured: z.boolean().default(false),
    featuredOrder: z.number().optional(),
    summary: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
