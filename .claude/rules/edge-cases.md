# Edge cases

Traps that came back more than once. Each cost time because the wrong thing was blamed.

## Suspect the measuring tool before the code

Every "this is broken" report that turned out to be wrong came from a measurement, not the site.

- Headless `--window-size` is not the layout viewport. A page asked for 375px rendered at 500px and
  the screenshot was merely cropped. Use CDP `Emulation.setDeviceMetricsOverride`, then confirm
  with `document.documentElement.scrollWidth === innerWidth`.
- Headless virtual time does not advance CSS transitions, so reading a property mid-transition
  returns the starting value. Inject `transition: none` before measuring.
- `Range.getBoundingClientRect` returns the font's em box, not the visible ink.

## The dev server can be serving old code

`astro dev` runs as a daemon. A newly started one loses the port while the old process keeps
answering, so the code changes and the screen does not. This was reported as a bug twice while the
build was fine the whole time.

Check the real port with `astro dev status`. After clearing `.astro`, kill the process too, then
start again.

## Reverting takes unrelated work with it

`git checkout -- src/content/posts/` undid a bad sweep and also deleted cover-image and category
changes living in the same folder. Before reverting a path, look at what else is in it. Narrow to
individual files, or commit the work worth keeping first.

## What Jekyll did for free, Astro does not

Jekyll copied everything at the repository root into the output. Astro copies only `public/`.
Site-verification files and `ads.txt` were about to disappear from the first deploy, which would
have dropped search engine ownership. When replacing a tool, list what the old one did implicitly
before trusting the new one.

## Case sensitivity differs between local and CI

macOS resolves `.jpg` to a file named `.JPG`; Linux does not. An image can work locally and 404
only after deploy. Verify assets over HTTP against the built output, not against the filesystem.
