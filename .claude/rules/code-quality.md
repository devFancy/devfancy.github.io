# Code quality rules

## Comments carry only what the code cannot say

Three kinds stay. Everything else goes.

1. Browser and platform traps, with the symptom named.
2. Jekyll URL compatibility, so nobody "cleans up" a rule that keeps 319 URLs alive.
3. A decision **not** taken, so nobody undoes it by accident.

A comment that restates the code becomes a lie the moment the code changes. That is why this
repository went from 365 comment lines to around a hundred. A bracketed keyword at the end of a comment
(`[URL 보존]`) groups related places; `docs/COMMENT-KEYWORDS.md` lists the ones in use.

## Define a thing in one place

Chip sizing lives in `global.css` alone, because chips are built in two places: server-rendered by
`Chip.astro` and by `innerHTML` in `category.astro`. Spreading dimensions across utility classes
means one gets fixed and the other does not.

The same applies to colors (tokens), the outer width (`.shell`), the navigation list and the
featured list (both in `config.ts`).

## Fix the generator, not the output

319 posts were converted by a script, never by hand. When a rule changed, the script changed and
ran again, and the result had to be identical on a rerun. The moment one file is edited by hand,
nobody can tell how far a rule actually reached.

Exceptions belong in the script as named data, not as a manual edit. Three posts that needed a
different category were listed by slug in a `CATEGORY_OVERRIDE` map.

When a generator has done its job, delete it. Keeping a converter around implies the old source is
still authoritative.

## Do replacements in a single pass

Sequential `replace` calls rewrite what an earlier rule already changed: `competition` became
`etc/competition`, then the `etc` rule turned it into `/etc/etc/`. Combine the rules into one
regex alternation and sweep once.

Include code in the sweep, not just markdown. A path hardcoded in an `.astro` file is missed
otherwise.

## Watch CSS specificity

Tailwind arbitrary-value utilities (`text-[14px]`) do not win by coming later in the class list.
**The CSS output order decides**, so a conditional size can be silently ignored.

Hand-written rules fail the other way. `button.chip:hover` scores 0-2-1 and beats
`.chip[aria-pressed='true']` at 0-2-0, which painted selected chips as if they were not selected.
Add `:not(...)` so a rule cannot match the state it must not touch.

## Pick the hard cases first

The migration pilot was five posts chosen for being difficult: the most code blocks, the most
images, the most math, a `$` collision, and the oldest post. Easy samples prove nothing and push
the real problems to the end.
