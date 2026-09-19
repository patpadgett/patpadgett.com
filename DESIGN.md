# DESIGN.md — genx.patpadgett.com · "The Bedroom, 1988"

Candidate replacement for the patpadgett.com hub, designed for and from a 1980s/90s kid. Owner-pinned world (2026-09-16): a fusion of three concept-seed candidates — Channel 3 (woodgrain console TV, the roll), The Cartridge Shelf (NES carts, the pick) and Dial-up BBS Nightboard (the challenger). Seed key 18c9a192.

## Thesis
The page is a kid's bedroom on a Saturday morning. The woodgrain Zenith is the front door (channels 3 MUSIC · 4 WORK · 5 BLOG), the NES shelf under it is the table of contents (MUSIC · INTERESTS · WORK), the VHS clamshell is the bio, the cassette is the record, the sticker sheet is the interests, the Mac Plus running Hermes II BBS is where the work started, and the Garbage Pail Kids wax pack is the contact footer.

## Photoreal pass (owner request, 2026-09-16)
Objects are photographs, not CSS drawings: gpt-image-2 plates on transparent backgrounds in assets/plates/*.webp (tv, cassette, vhs, cart, mac, waxpack, sticker, grain). Real content is positioned onto measured regions of each plate (percent boxes in styles.css: TV glass 11.5/14/62/65, knob centre 86/21 ⌀11, cassette clear label strip 10/15.5/80/17, cart recess 40.5/13.5/44.5/53.5, Mac glass 17.5/19.5/66/34, VHS sleeve 20.5/12.5/68/81 at −1.6°). Regenerating a plate means re-measuring its box.
Portrait: real photo → tools/film.py (126 Instamatic square print: soft lens, magenta/cyan dye drift, blown warm highlights, clumpy RGB grain, edge-only chromatic fringe, halation, seven-segment '88 7 14 stamp, cream border) → assets/portrait-film.png.
Mac Color Classic screen cycles on scroll (IntersectionObserver, ≥45% visible): Hermes II login → ACiD-style ANSI (inline SVG pixel letters, so block art never depends on font metrics) → THINK Pascal window (System 7 chrome). Tabs under the screen switch manually; reduced motion stops the cycle.
Soundtrack: assets/audio/bedroom-1988.mp3 — ACE-Step, seed 1988, 60 steps, 120 s loop, 128 kbps, 1.5 s fades; opt-in PLAY on the tape deck (browsers block autoplay with sound, and it would be rude anyway). Provenance line in footer.

## Materials
- Walnut veneer: `--walnut/-2/-3/-hi` with a repeating-linear-gradient grain on body and cabinet. Woodgrain on almost everything, as briefed.
- CRT glass: `.tv__glass` 4:3, rounded-rect, inset vignette, `.scan` scanlines (multiply). Phosphor is the only place gradients/glow are allowed.
- Grey plastic (`--grey*`) for cartridges; label art black band + flat colour; gold seal.
- ANSI 16-colour on black for the BBS (`.ansi .c/.m/.y/.g/.w`).
- Pastel + neon as flat fields/stickers: slime `#39ff14`, pink `#ff6ec7` (label pink darkened to `#c2185b` for contrast), cyan `#22d3ee`, Countach red `#d81e1e`, yellow `#ffd53d`, lavender, peach.

## Type
- Bangers (display, cartoon title lettering) — `--disp`
- Press Start 2P (pixel: knob detents, labels, guide head) — `--pix`, floor 11px
- VT323 (terminal: BBS screen, asides) — `--term`
- Nunito variable (reading) — `--body`, 16–19px
All self-hosted in assets/fonts (latin subset only).

## Signature interaction — the knob
`#knob` (button): press → turns to next channel, shows a 2.6 s station bumper on the glass; press again while the bumper shows → tunes in (navigates). Arrow keys and mouse-wheel turn it. TV Guide rows are real links; with JS they flash a "TUNING IN…" bumper for 700 ms first (modifier-clicks and reduced-motion bypass). Detent click sound is Web Audio, OFF by default (`#sound` toggle, aria-pressed).

## Motion grammar
Power-on: colour bars hold 1.1 s, title snaps in with `steps(6)` (`.js .title`). Reels spin, cursor blinks. Everything else is snap, no eased fades. `prefers-reduced-motion` → `.static`, all animation ≈0.

## Layout
Strict cell grid (raised from the split-flap candidate). Desktop: TV 1.55fr / panel 1fr; shelf 3 carts; VHS spine 56px; cassette 1/1; stickers 3×3; Mac .9fr / log 1.3fr; pack 5 cards. ≤900: single column, stickers 2 cols, pack 3. ≤640: cartridges become horizontal shelf rows (`.cart__label` two-column), VHS spine horizontal, pack 2 + full-width gum, guide URLs hidden. ≤380: knob 72px, stickers 1 col, pack 1 col. 0 overflow at 320/390/1366.

## Detector exceptions (world, not defects)
- Repeating-gradient stripes = woodgrain and cartridge grip ridges.
- Glow text-shadows on `.title__*` and `.detents .on` = CRT phosphor (inside the glass only).
- `#ddd on #39ff14/#22d3ee/#c2185b` = static read of `.cart__label small`, which actually sits on the black top band of the label gradient.
- `#000 on #000` = `.bumper` before JS assigns its channel class, and cassette shell.
- Nested cards = physical objects (cartridge label inside cartridge, sticker inside sheet).
- `.mac__case` bottom inset shadow = the Mac's chin, not a side-tab accent.

## Content
Work log years supplied by the owner 2026-09-16 (1992/1993/1994/1995); no placeholders remain.

## Critique #1–#2 refinements
Title visible without JS and under reduced motion (`.js:not(.static)` gates power-on). Manual Mac tab pick pauses the cycle. Mobile order TV → cartridge shelf → TV Guide → deck. Dial hint lives at the foot of the TV Guide (the control panel has no clear room). Inline links and Mac tabs ≥44px. Mobile microtype floors: tape 10/11px, VHS 8/11px, deck 9px, cart subtitles 7px (catalogue-code exception). Wax-pack caption rotates +15° to match the plate. `.log li:last-child` (current availability) is boxed. Plates ship in -xs/-s/full srcset; initial transfer ≈1 MB, MP3 (1.9 MB) only on PLAY. Footer carries no process copy; provenance is here.

## Madballs + Garbage Pail Pat (owner request)
Interests became MADBALLS: nine original gross-out rubber-ball characters (gpt-image-2, transparent PNG → assets/toys/ball-*.webp ≤512px), one per obsession, each with a yellow blister-card name tag (`.ball__tag`) and one line. Contact became five original GPK-style painted cards (assets/toys/card-*.webp, 2:3): white sticker border, flat colour field per card (`--bg`), yellow name banner, blue "1a–5a" badge; the wax-pack plate sits above them. Characters are homage to the brief's references (NES texture, checkerboard high-tops, masked swordsman) with no rendered text; the tools/toys.py prompts are the source of truth — re-render any card with `python3 tools/toys.py <name>`.

## The Color Classic screens (current)
1. **ZTerm** — System 7 chrome (`.macos--dark`, `.macwin--zterm`), black VT100 pane (`.zterm`): `CONNECT 2400` → `SunOS UNIX (databank)` → `databank login: patpadgett` → `who` / `finger` → `databank%` prompt with blinking cursor. Host name "databank" is owner-pinned.
2. **ANSI** — owner-supplied artwork assets/bbs-ansi.jpg (The Dark Side BBS, ACiD-style, SysOp Agroman), bezel cropped to the glass → assets/ansi/dark-side{,-s}.webp, `object-fit:cover`, drawn top-down in 30 steps over 4.5 s (`@keyframes ansidraw`, clip-path) like a 2400-baud ANSI pour; dwell 9 s. tools/ansi.py (generated Hermes II scroller) is retired but kept.
3. **Pascal** — THINK Pascal window, WhoIsOn.p external.

## The coffee table
Section `#table` between Music and Madballs. Photoreal worn laminate table plate (assets/mags/table.webp) with an amber ashtray plate (ashtray.webp) bottom-right and CSS smoke (five blurred radial puffs, `@keyframes puff`, 5.5 s staggered; static fallback shows two puffs). Eight owner-supplied covers (assets/mags/mag0..7.jpg — Kerrang!, SPIN, Thrasher, Hit Parader, RIP, Rolling Stone, CREEM, Circus) fanned via per-item `--x/--y/--r/--z`; click lifts one (`.mag.up`: to top-centre, z 20, scale 1.7 desktop / 1.25 mobile) with a caption and dims the rest (`.table.has-up`); click again, Esc, or clicking bare table puts it down. Buttons carry aria-pressed; hint line is a live region.

## The shelf (current)
Four cartridges, parody launch titles → sections: SUPER BASS BROS. (Music), MAG HUNT (The coffee table), MADBALL'S PUNCH-OUT!! (Madballs), SYSOP'S QUEST (Work). Label = 8-bit art window (assets/carts/label-*.webp, tools/carts.py) over a black→dark-red band with cream title and gold destination line; recess grid `minmax(0,1fr) auto` so the band never clips. Homage is the joke (moustache-free rocker, laughing dog with a magazine, boxer vs rubber ball, kid at a modem).

## PP-006 · Booking records (grime95!)
Section `#grime95` after Octavitin; channel 7 on the knob, guide and remote. The remote plate was regenerated with seven buttons (assets/plates/remote7.webp, tools/grime-plates.py; button centres 18/29/40/51/62/73/84 % of plate height, MOTION switch moved to the wood at 95.5 %). Knob detents re-spaced to five stops (−104/−52/0/52/104°). Bumper 7 = DOS blue on yellow, the terminal's own palette.
The desk: a Polaroid (`.polaroid`, −4°, real mugshot from grime95.com) to the LEFT of a photoreal beige 9-pin dot-matrix printer (assets/plates/printer.webp, slot measured x 13→87 %, sheet edge tucked at the platen = 24 % of plate width). The sheet is grime95's own green-bar printout — same tokens (`--gpaper/--gbar/--gink`), Courier Prime + Doto (copied from grime95.com/assets/fonts/vga, OFL), tractor holes, dashed tear lines — so the record looks identical to the terminal's. Static HTML ships the booking that was latest at build time; grime.js fetches grime95.com/ledger.json (CORS *) for the newest booking, then /rec/<booking>/ for the first two narrative paragraphs, swaps the Polaroid, and re-feeds the sheet. One authored moment: the sheet feeds out of the slot in 32 steps when the desk enters view (`.is-fed`); MOTION off / reduced motion show it settled.
Copy is grime95.com/about verbatim (owner request). CTAs: Open the ledger ↗ (yellow), Follow by RSS (ghost).
