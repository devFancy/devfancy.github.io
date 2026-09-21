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

---

## The one hard constraint: URLs do not change

The URLs of 319 posts are already in search results and in links other people wrote.
Every other decision is tied to this.

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
npm run build    # 325 pages
npm run check    # astro check
npm run lint     # biome
```

With a `C` locale the build fails on Korean filenames. Prefix with `LC_ALL=en_US.UTF-8`.
CI sets it for the whole job.

## How work is done

- **Never commit directly to `main`.** Branch, then open a PR.
- Stop at each phase, get approval, then move on. Do not open the next branch before that.
- Stack branches when the work depends on earlier work, and merge in order. After merging a lower
  PR, move the base of the one above it and confirm it is not already merged.
- Write issues and PRs **in English**, following the templates as they are
  (`.github/ISSUE_TEMPLATE/task.md`, `.github/PULL_REQUEST_TEMPLATE.md`).
- Put `devFancy` in `assignees` on every issue and PR.
- No em dashes and no emoji in issue bodies, PR bodies or commit messages. Use a hyphen.

### Commits

- One line for the subject, written in Korean, saying what changed and why.
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
- Measure the viewport with CDP `Emulation.setDeviceMetricsOverride`, setting width, height and DPR
  explicitly.
- When changing something shared, **find every place it is used first**, then check each one.
  The same thing can exist in two implementations.
- After a deploy, check the live site. GitHub Pages sends `max-age=600`, so the old page can keep
  showing for ten minutes and look like a bug that is not there.

## Deployment

`main` pushes run `.github/workflows/deploy.yml`, which builds and publishes to GitHub Pages.
Lint and type checks run before the build so a broken commit never reaches the site.

Build and deploy have **separate concurrency groups on purpose**. Builds cancel each other so only
the newest commit is built; deploys never cancel, so Pages is not left half-published. Merging
several PRs in a row without this published intermediate states.
