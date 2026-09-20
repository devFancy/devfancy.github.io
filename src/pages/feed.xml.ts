/* NOTE Jekyll 이 /feed.xml 로 내보내던 RSS 를 같은 경로에 유지한다 [URL 보존]
 * - 경로가 바뀌면 기존 구독자의 리더가 조용히 끊긴다
 * - 문제풀이는 한 번에 여러 편이 올라와 피드를 덮으므로 뺀다 [문제풀이 분리]
 */

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
