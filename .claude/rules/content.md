# Content rules

Posts live in `src/content/posts/*.md`. **The filename is the URL.**

Name a new file in lowercase with hyphens (`spring-boot-kafka-dlq.md`). The 305 existing posts
carrying uppercase are left as they are: their addresses are already indexed, and renaming them
would change almost every URL on the site. New posts have been lowercase since late 2025, so the
convention arrives on its own without touching anything old.

```yaml
---
title: "..."
date: 2026-09-21
categories: ["서버"]   # exactly one, from CATEGORY_GROUPS in config.ts
tags: ["Spring"]      # display order comes from TAG_ORDER in config.ts
use_math: true        # only when the post has math. Controls conditional KaTeX CSS
thumbnail: /assets/img/server/cover/x.jpg   # only on posts that declare one
---
```

The schema in `src/content.config.ts` validates this, so a typo fails the build instead of
silently dropping a post.

## Categories and tags

- Categories are two levels. Put **only the leaf** in the frontmatter. Adding the parent puts a
  chip carrying no information on nearly every card.
- One category per post. A post in two categories makes the list and the filter disagree.
- A tag belongs to one category only, for the same reason.
- Problem-solving posts are kept out of the home page and the feed. Several land at once and they
  take over anything sorted by date.

## Cover images

- A cover appears only when the post declares `thumbnail`. **Never derive one from the first image
  in the body**: 172 of 190 posts start with a screenshot or a diagram, which pushes the title down
  and shows something the reader is about to see anyway.
- **Landscape only.** Portrait loses its subject when cropped to 16:9.
- `scripts/make-covers.mjs` builds the 16:9 file before `dev` and `build`. Output goes to
  `public/assets/cover/`, which is gitignored and rebuilt by CI.
- Pick the crop with `thumbnailPosition` (`top`, `center`, `bottom`). Automatic subject detection
  chose bright regions and missed the subject.

## Markdown that Astro reads differently from Jekyll

These were found post-migration, in rendered pages, not at build time.

- **`**` emphasis fails in front of Korean particles.** A closing `**` must be right-flanking, so
  `**(설명)**입니다` never closes and the asterisks render as text. 69 lines across 42 posts were
  fixed for this. Before changing anything, read the spec again: the punctuation clauses of the
  CommonMark rule apply to `_`, not to `**`, and applying them to `**` flags thousands of
  false positives on healthy text.
- **Math is global.** `remark-math` applies to every file, so two `$` in one post turn the text
  between them into a formula. `use_math` only controls whether the KaTeX stylesheet loads.
- **Kramdown syntax does not exist here.** `{:toc}` and `{: width="300"}` render as literal text.

After changing post bodies in bulk, check the **rendered** page, not the source.

## Do not put Tailwind classes in post bodies

`src/content/` is excluded from Tailwind's class scan in `global.css`. Without that, ordinary English
words in posts ("filter", "fixed", "inline", "static", "table") were read as class names and shipped
1,295 bytes of unused CSS. The same happened with the documentation before it was excluded too.
