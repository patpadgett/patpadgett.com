---
name: Patrick Padgett homepage
description: An acid-yellow personal index with ruled destination links.
colors:
  paper: "#e8ed38"
  ink: "#20231c"
  muted: "#505529"
  line: "#a4aa31"
  focus: "#303ab1"
  hover: "#dce22f"
typography:
  display:
    fontFamily: "Manrope, sans-serif"
    fontSize: "clamp(56px,7.3vw,96px)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Manrope, sans-serif"
    fontSize: "clamp(30px,4.2vw,46px)"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Manrope, sans-serif"
    fontSize: "15px"
    lineHeight: 1.6
  label:
    fontFamily: "Manrope, sans-serif"
    fontSize: "12px"
    letterSpacing: "0.01em"
components:
  destination:
    textColor: "{colors.ink}"
    padding: "28px 0"
  destination-hover:
    backgroundColor: "{colors.hover}"
    padding: "28px 16px"
---

# Design System: Patrick Padgett

## Overview

**Creative North Star: "Independent-record mailorder sheet"**

The implemented surface is a flat personal index: saturated paper, near-black lettering, large identity typography, and full-width ruled links. Typography and spacing carry the hierarchy; no photography, cards, gradients, or decorative imagery are used. This records the existing code-led implementation, not a proposed redesign or a comp match.

## Colors

Paper covers the page; ink carries primary text and the navigation's top rule. Muted olive identifies destination addresses and the contact email. Line provides subordinate row separators. The blue focus accent marks the name's period and keyboard outlines. Hover supplies a slightly darker yellow-green row surface.

Text selection reverses ink and paper. The scrollbar uses the same pair. The document declares a light color scheme and a paper-colored browser theme.

## Typography

Manrope is self-hosted at `assets/manrope.woff2`, declares variable weights 200–800, uses `font-display: swap`, and falls back to sans-serif. The name deliberately occupies two lines. Desktop display and destination-title values are recorded above.

The introduction is 18px/1.6 at weight 500. Descriptions are 15px/1.6; domain labels are 12px. Footer links are 14px at weight 650; the email is 12px at weight 450. These are short directory labels, not long-form reading measures.

At widths up to 640px, the name is 64px, destination titles 34px, introduction 16px/1.5, descriptions 14px, footer links 13px, and email 11px. At widths up to 360px, the name becomes 58px.

## Layout

A centered, border-box main container has a maximum width of 1040px, padding of 64px 48px 32px, and minimum height of 100svh. Its vertical flex layout pushes the footer toward the bottom when space permits without fixing it over content.

The desktop header aligns the introduction beside the name at the bottom, with a 32px gap and 54px bottom padding. Destination rows use a `1fr 1fr 32px` grid, 24px column gaps, and 28px vertical padding.

At 640px and below, main padding becomes 40px 24px 24px; the introduction moves below the name with 24px top margin, and header bottom padding becomes 32px. Rows use `1fr 28px`, an 8px gap, and 22px vertical padding. Descriptions sit below titles; arrows span both rows. Below 361px, side padding is 20px.

Footer spacing is 28px on desktop, 20px on mobile, and 14px at the narrow breakpoint. Its top padding is 40px on desktop and 30px on mobile; the contact link takes the available space before social links.

## Elevation & Depth

No shadows, overlays, or simulated depth. Rules and tonal interaction feedback supply separation on a single flat plane.

## Shapes

Rectilinear, unboxed navigation. A 2px top rule introduces the destination list, and 1px rules divide its rows. Authored SVG northeast arrows use a consistent 1.7 stroke width and no fill; their boxes are 30px on desktop and 26px on mobile. No raster assets ship as part of this page.

## Components

**Destination row:** one native anchor includes its title, description, displayed address, and decorative `aria-hidden` arrow. The three exact destinations are `https://music.patpadgett.com`, `https://resume.patpadgett.com`, and `https://blog.patpadgett.com`; they navigate in the current tab.

Hover and keyboard focus change the row surface and inset its contents by 16px on each side. Hover moves the arrow 2px right and 2px upward. Padding and transform transition over 0.22s with `cubic-bezier(.16,1,.3,1)`; background color transitions over 0.22s with the CSS default easing. Reduced-motion preference removes transitions; content is visible without animation.

**Keyboard focus:** a 3px solid accent outline uses a 5px offset on ordinary links and a -3px inset on destination rows.

**Contact footer:** email, GitHub, and LinkedIn are native links. Link targets have a minimum height of 44px and 6px vertical padding. Hover underlines footer text with a 5px underline offset.

**Document semantics:** English language, one h1, main/header/nav/footer structure, and a named navigation landmark. There is no JavaScript UI, form, asynchronous data, or applicable loading/empty/disabled state.

## Do's and Don'ts

- Do preserve the acid-yellow field, locally hosted type, clear hierarchy, ruled rows, and visible focus treatment.
- Do keep each primary destination a whole-row native link with the exact requested URL.
- Do retain responsive reflow and reduced-motion support.
- Don't add card scaffolding, stock imagery, or decorative motion to this compact directory.
- Don't interpret this document as deployment approval or proof that external destinations are reachable.

## Motion
- Focal: the vat pours in stirred (`stir=1.35`, off-centre) and settles on wall-clock time (~1s constant) then FREEZES — rAF stops. Pointer/finger over the `h1` re-stirs it. One scheduler; context loss tears down to solid ink and rebuilds on restore; ResizeObserver drops the fill for one frame and rebuilds the mask so no stale geometry ever shows.
- Feedback: `.destination` hover/focus = tinted band via `::before` (no reflow), `.name` translateX 12px, arrow translate(3,-3); `:active` pushes further in 100ms. Ease `cubic-bezier(.16,1,.3,1)`, 220–280ms.
- Reduced motion: no vat canvas; transitions collapse to .01ms; translates removed; the hover band still appears (feedback survives).

## Delight
- The blue period is the seal: click it (or press Space with nothing focused) and the vat pours again from the period's corner. It is `aria-hidden`, not a tab stop, so it never gets ahead of the destinations. `.is-pressed` gives a 100ms press.
- `404.html` lives in the same world: "Nothing here." + the requested path, then the three destination rows and "the front". Root-absolute asset paths so it renders at any depth. `noindex`.
