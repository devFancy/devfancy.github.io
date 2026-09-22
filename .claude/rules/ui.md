# UI rules

## Color is defined only as tokens

Declare it in `@theme` in `src/styles/global.css`, then **redefine the same name** under
`:root[data-theme="dark"]`. Never write a color value into a utility class or a component.
`global.css` is the only place the values live; this file does not repeat them.

Pure black on a white ground is too hard to read for long, so the base text color is a dark grey on
a paper tone rather than black on white.

**When a color changes, measure the contrast again.** Body links must clear AA (4.5:1). Softening
the background once dropped the accent below that without anything looking wrong.

## Blue is for going to a post, everything else is grey

| What | Hover |
| --- | --- |
| A link to a post (`.link-title`) | Accent |
| Chips, whatever they do | Grey |
| Anything sitting on a photo | White family |
| A chip that is currently on | The strongest neutral, so it beats hover |

Blue is the strongest color here, so it means one thing only. Chips are grey whether they navigate
or filter, which means a new chip needs no decision: its element and its position do not change the
color. Header navigation follows the same idea from the other side: over a photo it does not change
color, it gets sharper.

## Height gets a minimum, never a ratio

`aspect-ratio` pins the height, and then `overflow: hidden` cuts the title off as soon as it wraps.
Use `min-height` with `clamp()` so the box grows with its content.

A related trap: when the title is anchored to the bottom, growing the box does not grow the photo.
What grows is the empty band above the title.

## Mobile

**A 44px tap target has to be built, not declared.** `global.css` carries
`@media (pointer: coarse) { a, button { min-height: 44px } }`, and that rule does nothing on its own:

- an `inline` element ignores `min-height` entirely, so plain text links are unaffected
- a component that sets its own height wins on specificity, so `.chip` stays 26px

It only lands where the element is already `flex`, `grid` or `inline-flex` and sets no height of its
own. Icon buttons (theme toggle, hamburger, social links) get their 44px from an explicit size class.
When a link genuinely needs a finger-sized box, give it `display: inline-flex` and let the rule apply,
or set the height there.

Small inline chips are acceptable at 26px because they are wide enough to hit, but do not claim they
are 44px.

**`:hover` sticks after a tap** and stays until the next tap elsewhere. Never let hover be the only
signal for a state.
