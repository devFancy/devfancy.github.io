# Code quality rules

## Write no comment unless the code cannot say it

**The default is no comment.** Reach for one only after trying to make the code say it instead:
rename the thing, extract the condition, restructure. A prop called `filter` that rendered a
`<button>` needed a comment; renaming it to `button` needed none.

Only three kinds earn a place.

1. Browser and platform traps, with the symptom named.
2. Jekyll URL compatibility, so nobody "cleans up" a rule that keeps 319 URLs alive.
3. A decision **not** taken, so nobody undoes it by accident.

### A comment is a claim you have to keep true

Each one is a promise that ages badly. Three broke in a single day of work here.

- Reverting a height experiment left **two stacked blocks** saying the same thing. Nobody deleted
  the old one, because adding is easier than editing.
- A component header said it was the **only** place chips are built. Two other places built them.
  The word "only" was true when written and false a week later.
- A comment explaining that stray words leak into the CSS bundle **contained such a word**, and
  shipped 1,166 bytes of unused CSS. Source files are scanned too, so a comment is not inert text.

So: when you change a line, the comment above it is part of that change. Avoid "only", "always" and
"every" unless you just verified it and re-verifying is cheap. Never restate what the line does.

**Never restate a rule either.** These files are the source for how the site is built, so a comment
that repeats one gives it a second home that ages separately. A comment saying chips react in grey
was deleted for this: `ui.md` already says it, and the code around it was already grey.

If a comment is longer than the code it explains, that usually means the code should change.

### Form

Every comment opens with `NOTE:`, at any length. It is not decoration: it makes the claims
greppable, so `grep -rn 'NOTE:' src/` lists everything that has to be re-verified when the code
around it moves.

One line takes `//`. Two or more take `/* */`. CSS has no line comment, so it takes `/* */`
at any length. Reach for the block form because the comment needs the room, never by habit.

A bracketed keyword at the end (`[URL 보존]`) groups related places; `docs/COMMENT-KEYWORDS.md`
lists the ones in use. Do not invent a new keyword without adding it there.

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
