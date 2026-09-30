# patpadgett.com

The hub. "The Bedroom, 1988" — see DESIGN.md. The previous hub (acid-yellow ink vat) lives at /classic/.

Flat HTML/CSS/JS, GitHub Pages, CNAME patpadgett.com. Regenerate object plates / toys / cart labels with the scripts in tools/ (Foundry gpt-image-2 key in ~/.hermes/.env).

## Polish pass (2026-09-26)

Measured round on 320/390/1024/1440, reader and 404, then one batched fix:

- `.who__warn` was inheriting `.who__copy p{font-size:18px}` (specificity) — the FBI line rendered as an 18px pixel-type slab; now the intended 11px via `.who__copy .who__warn`.
- 404 overflowed on phones (90vw glass + 48px padding = 411px at 390); glass is `min(100%,720px)` and the page resets the homepage's absolute `.tv__glass`.
- `.btn` is now border-box inline-flex, 52px, with a 3px transparent border so slime and ghost buttons match in every pair on every viewport.
- Unicode glyphs (▶ ↗ ✉ → ↑ ↓ ✦ ▌) replaced by an inline SVG sprite (`#i-play … #i-star`) and a CSS block cursor; the fonts never carried them, so every visitor got a different system glyph.
- All 23 hover rules moved behind `@media(hover:hover)` so taps don't leave stuck states.
- `.guide__sub` #8a6a3a → #745628 (4.35:1 → 5.9:1 on the paper).
- Work log rows align year and text on the baseline; drop cap reseated on the second line; reader backdrop opaque; cartridge captions and label bands fit at 320 (the sub-line under the band is dropped below 380px).
- Browser surfaces: `::selection` per world (yellow / orange in the reader / grime yellow), `scrollbar-color` from the palette, thin themed scrollbar inside the reader page.

Probes: `~/.hermes/cache/scratch/pp/{confirm,engines,bands}.cjs` (Playwright; Chromium/WebKit/Firefox).

## Follow-up (2026-09-26, same day)

- Hero breakpoint 1100 → 1000px: the TV Guide card sits beside the set on 1024-wide tablets/laptops and fits the 768px fold with its footer (was single-column with the guide starting at y=478). `DESIGN.md` updated.
- Pushbutton rail re-seated on the plate's control strip: dot centre lands at 0.8985 of the cabinet height at every two-column width (strip centre measured at 0.899 from the plate's luminance profile), dots scale with the cabinet (`min(26%,20px)`), caption floor 7px, numerals 3px clear of the buttons, captions clear of the plinth by ≥3px.
- ≤380px: rail 7px wider each side with even `minmax(0,1fr)` cells so BEDTIME and GRIME95 keep air.
- THE SITES rows: the site address is a deliberate third line (`.guide__dom--url{display:block}`) instead of a one-word orphan; `.guide__d` gets `text-wrap:pretty`.
- `Doto-var.woff2`: the STAT table's wght=900 axis value pointed at nameID 17, which the subset had dropped; Firefox discarded the table and logged two errors on every load. NameIDs 16/17 restored (+32 bytes).
- Hero → About gap: `.who` top padding `clamp(16px,2vw,28px)` (was up to 56px on top of the 28px row gap) so the band of wood under the guide is section spacing, not a hole, and the VHS sleeve arrives inside the 900px fold.
- THE SITES addresses set in VT323 15px `#745628` as a station-ID field (5.6:1 on the paper); DESIGN.md updated.

## Overdrive pass (2026-09-26)

`crt.js` (new, ~9 KB gzipped, loads after `set.js`): a WebGL1 tube over the glass (curvature, aperture grille, scanlines, bloom, phosphor persistence; roll/tear/snow on a channel change, the beam collapse on power-off), the room lit by the set (soft-light lift + screen-blended phosphor hue in the tuned channel's colour, dying with the power; pointer/tilt-driven glass reflection and guide shadow), and View Transitions for channels 6/7 (the numeral settles into the section tag). All three degrade to the previous CSS behaviour with no WebGL, reduced motion, or no JS. Verified: Chromium/WebKit render the tube, Firefox (no WebGL headless) keeps the CSS picture, zero console errors in all three; a11y tree of the glass unchanged; reduced-motion gets no canvas, no lamps, no transition; steady-state loop pauses offscreen and when hidden. Details in DESIGN.md → Overdrive.

## Critique round 9 + fixes (2026-09-30)

Dual-agent critique of the post-overdrive build: 25/32 (H7/H10 n/a), one P1. Snapshot in `.impeccable/critique/2026-09-30T03-16-39Z__index-html.md`. Fixed in the same round:

- **The résumé door (P1).** The guide promised "Full résumé" and sent people to work.patpadgett.com, which positions Patrick as DevOps/Cloud; resume.patpadgett.com (billing-mediation-first one-sheet, PDF/DOCX/TXT) was not linked anywhere. New guide row RÉSUMÉ (document icon badge, no channel number) directly under WORK; WORK re-described with the specialty; the work log's Looking row links both ("Résumé (PDF) · the long version on channel 3").
- **Phone payload (P2).** 390px @ DPR3 was 1.62 MB because every plate's srcset jumped from its small candidate to the 1536w master. Intermediates added (`tv-m` 1200w, `cassette-900`/`cassette-m` 1200w, `printer-m` 1200w, `mac-m`/`vhs-m`/`dark-side-m` 800w, `cart-m` 540w, `waxpack-m` 1100w), `sizes` rewritten from measured widths, the body grain tile is a 1100w/q60 encode (35 KB vs 110 KB), and the 600 KB `book.webp` master left the srcset (renders ≤563px). Measured after: 390 @ DPR3 1.62 → 1.04 MB, 390 @ DPR2 0.80 → 0.81 MB (same), 320 @ DPR2 0.76 MB, 1440 @ DPR1 0.95 → 0.98 MB, 1440 @ DPR2 1.52 → 1.48 MB. The TV preload mirrors the new srcset so no viewport downloads two TVs.
- **No-JS honesty (P2).** POWER, MUTE and the "MUTED · press MUTE" status line are hidden without JavaScript (`html:not(.js)`); channel keys are real links and stay. Verified with JS disabled: five keys, no status line, name legible.
- **Compact guide cascade (found while verifying).** The ≤1000px guide rules sat *above* the base `.guide__*` rules in styles.css and lost every tie, so phones rendered the 56px desktop rows. Moved after the base rules; the phone card is 96px shorter and the Email row bottoms at 815px on 390×844 (was 907, below the fold once RÉSUMÉ was added).
- The printout header now says "Fictional record" instead of "Records inquiry" so the disclosure survives a crop or share.
- Doctor: PRODUCT.md and the surface brief no longer describe this as a genx-staged candidate; the sidecar's stamp was refreshed (its tokens were unchanged).

Open from the critique (owner's call): distill the printer preview (`/impeccable distill`), lead the contact section with a plain Email · LinkedIn · GitHub line (`/impeccable layout`), Hotjar consent (keep / drop / gate). Probes: `~/.hermes/cache/scratch/pp/{signals-live,rendered-widths,verify-fixes}.cjs`.
