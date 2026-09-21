/* Jekyll 이 쓰던 /feed.xml 경로를 유지한다. 바뀌면 기존 구독자의 리더가 조용히 끊긴다 [URL 보존] */

import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { SITE, SOLUTION_CATEGORIES } from "../config";

export async function GET(context: APIContext) {
  const solution = new Set<string>(SOLUTION_CATEGORIES);
  const posts = (await getCollection("posts", ({ data }) => !data.draft))
    .filter((p) => !p.data.categories.some((c) => solution.has(c)))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site ?? "https://devfancy.github.io",
    items: posts.map((p) => ({
      title: p.data.title,
      pubDate: p.data.date,
      description: p.data.summary,
      link: `/${p.id}/`,
      categories: [...p.data.categories, ...p.data.tags],
    })),
  });
}
