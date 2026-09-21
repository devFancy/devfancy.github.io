# UI rules

## Color is defined only as tokens

Declare it in `@theme` in `src/styles/global.css`, then **redefine the same name** under
`:root[data-theme="dark"]`. Never write a color value into a utility class or a component.

| Token | Light | Dark | Used for |
| --- | --- | --- | --- |
| `--color-bg` | `#fbfbf9` | `#15181c` | Page background. A light paper tone, not pure white |
| `--color-fg` | `#3b4149` | `#e7ebef` | Base text and headings |
| `--color-body` | `#474e55` | `#c6cdd4` | Long-form body text |
| `--color-muted` | `#5b6168` | `#a6adb4` | Dates and secondary text |
| `--color-accent` | `#2569bd` | `#6aa9f0` | Links and hover |
| `--color-quote` | `#a7adb3` | `#666e77` | Bullets and separators |
| `--color-brand` | `#2a3038` | `#eef1f4` | Logo |
| `--color-fg-strong` | `#1f242a` | `#f4f4f2` | A hovered title |

Pure black on a white ground is too hard to read for long, which is why the base is `#3b4149`
on paper rather than black on white.

**When a color changes, measure the contrast again.** Body links must clear AA (4.5:1).
Softening the background to paper once dropped the accent to 4.26:1 without anything looking wrong.

## Blue means "takes you somewhere", grey means "operates the screen"

| What | Hover |
| --- | --- |
| Links to a post or a category (card titles, chips that navigate) | Blue (`--color-accent`) |
| Controls (carousel arrows, filter chips, "see all", collapse) | Grey |
| Anything sitting on a photo | White family |

Blue is the strongest color on the site. On a control it makes the thing you just turned off look
louder than the thing that is on. Header navigation follows the same idea from the other side:
over a photo it does not change color, it gets sharper.

## Height gets a minimum, never a ratio

`aspect-ratio` pins the height, and then `overflow: hidden` cuts the title off as soon as it wraps.
Use `min-height` with `clamp()` so the box grows with its content.

A related trap: when the title is anchored to the bottom, growing the box does not grow the photo.
What grows is the empty band above the title.

## Mobile

- Tap targets are **at least 44px**, even when the icon inside is 20px.
- **`:hover` sticks after a tap** and stays until the next tap elsewhere.
  Never let hover be the only signal for a state.
