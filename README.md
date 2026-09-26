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
