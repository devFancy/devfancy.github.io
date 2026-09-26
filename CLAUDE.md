# devfancy.github.io

A personal engineering blog built with Astro. 319 posts were migrated from Jekyll in 2026.

Read the rule file for the area you are touching.

@.claude/rules/content.md
@.claude/rules/ui.md
@.claude/rules/code-quality.md
@.claude/rules/edge-cases.md

`docs/` holds working notes that are not committed (it is gitignored). When it exists locally,
read it before starting: it carries the migration record, the mistake log, the photo credits,
and any rule that should not be published. Nothing from `docs/` gets copied into this file
or into `.claude/rules/`.

### Adding a rule

The rule set is meant to stay small. **Only what does not change belongs here**: a platform
behaviour, a constraint you cannot trade away, a decision that is settled. If it has moved
recently it is still being decided, and writing it down makes the file lie the next time it moves.

- **Values live in code.** Color tokens, category lists, sizes and counts belong in `global.css`
  and `config.ts`. A rule may say *measure the contrast again*; it may not list the hex values.
- **Read the existing files first**, and when a new rule is close to one that is there,
  strengthen that one instead of adding a sibling. Two sections on one subject is the defect
  the comment policy warns about, one level up.
- When a later decision replaces a rule, **rewrite it** rather than stacking the new version on top.
- A rule earns its place by **recurring**. A single incident goes to `docs/`, not here.

---

## The one hard constraint: URLs do not change

Every post URL is already in search results and in links other people wrote. Every other decision
is tied to this.

- A post URL is its filename. There is no date prefix and **some contain uppercase letters**
  (`/Algorithm-Baekjoon-24479/`).
- `generateId` in `src/content.config.ts` is written by hand to stop the loader from lowercasing
  slugs. Leave it alone.
- `/feed.xml`, `/about/`, `/archive/`, `/category/` and the `/category/#Kafka` anchor all stay.
- Image paths in post bodies are public URLs too. Moving a folder breaks image indexing.

`_migration/urls-before.txt` on the `chore/url-baseline` branch is the snapshot taken before the
migration. It is the only source of truth for what a URL used to be, so it is never edited.

## Commands

```bash
nvm use && npm ci
npm run dev      # http://localhost:4321
npm run build
npm run check    # astro check
npm run lint     # biome
```

With a `C` locale the build fails on Korean filenames. Prefix with `LC_ALL=en_US.UTF-8`.
CI sets it for the whole job.

## How work is done

- Branch and open a PR for anything that can change the built site. Rules and docs go straight
  to `main`.
- Stop at each phase, get approval, then move on. Do not open the next branch before that.
- Stack branches when the work depends on earlier work, and merge in order. After merging a lower
  PR, move the base of the one above it and confirm it is not already merged.
- Write issues and PRs **in English**, following the templates as they are
  (`.github/ISSUE_TEMPLATE/task.md`, `.github/PULL_REQUEST_TEMPLATE.md`).
- Put `devFancy` in `assignees` on every issue and PR.
- No em dashes and no emoji in issue bodies, PR bodies or commit messages. Use a hyphen.

### Commits

- One line for the subject, written in Korean. Name the thing that changed and stop there.
  The reasoning belongs in the PR body, where a reviewer is already reading for it.
- Group by meaning, but **do not split more than the meaning requires**.
- Do not add a `Co-Authored-By` line.
- When regrouping commits that are already stacked up (rebase, squash),
  **show the result and get approval before pushing**.
- On a branch that is already pushed, use `--force-with-lease` only. Never `--force`.
- Check `git status --short` before committing. Build output must not be in the change.

## Verification

**"Applied it" is not a result.** Code changing and the screen changing are different things,
with caching, inheritance and selector specificity sitting in between.

- Size, spacing, alignment and color are **measured**, and the before and after are shown together.
  How to measure a viewport, and which tools lie about it, is in `.claude/rules/edge-cases.md`.
- When changing something shared, **find every place it is used first**, then check each one.
  The same thing can exist in two implementations.
- After a deploy, check the live site. GitHub Pages sends `max-age=600`, so the old page can keep
  showing for ten minutes and look like a bug that is not there.
- When a visual choice could go two ways, **render the options and let the person pick** instead of
  arguing from numbers. Four hero heights side by side settled in one look what a table of
  percentages had not.

## Deployment

`main` pushes run `.github/workflows/deploy.yml`, which lints, type checks, builds, and publishes
to GitHub Pages. Why the build and deploy jobs have separate concurrency groups is commented in
that file, next to the setting it explains.
