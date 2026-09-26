---
name: patpadgett.com — The Bedroom, 1988
description: Patrick Padgett's one-page front door, built as a 1980s kid's bedroom of photoreal objects that hold real content.
colors:
  walnut-room: "#24140a"
  ink: "#1a1210"
  cream: "#f3e7cf"
  paper: "#f6efdc"
  crt-black: "#050409"
  slime: "#39ff14"
  pink: "#ff6ec7"
  cyan: "#22d3ee"
  countach-red: "#d81e1e"
  yellow: "#ffd53d"
  lavender: "#c9b6ff"
  peach: "#ffb385"
  tape-cream: "#efe4c6"
  kraft: "#c7a066"
  book-navy: "#171d32"
  orangle: "#ffb16b"
  card-cream: "#f2e6c4"
  dos-blue: "#0000aa"
  dos-yellow: "#ffff55"
  greenbar-paper: "#f3f0e6"
  greenbar-band: "#d5e6d3"
typography:
  display:
    fontFamily: "Bangers, Impact, sans-serif"
    fontSize: "clamp(42px, 6vw, 84px)"
    fontWeight: 400
    lineHeight: 0.9
    letterSpacing: "0.02em"
  pixel:
    fontFamily: "'Press Start 2P', monospace"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1
  terminal:
    fontFamily: "VT323, monospace"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: "Nunito, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.5
  book:
    fontFamily: "'Brygada 1918', Georgia, serif"
    fontSize: "clamp(36px, 4vw, 54px)"
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: "-0.03em"
  printout:
    fontFamily: "'Courier Prime', 'Courier New', monospace"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.47
rounded:
  hairline: "1px"
  chip: "3px"
  button: "6px"
  disc: "50%"
spacing:
  xs: "8px"
  sm: "14px"
  md: "20px"
  section: "clamp(48px, 7vw, 90px)"
  gutter: "clamp(12px, 3vw, 40px)"
components:
  button-primary:
    backgroundColor: "{colors.slime}"
    textColor: "#000000"
    typography: "{typography.body}"
    rounded: "{rounded.button}"
    padding: "16px 20px"
    height: "48px"
  button-book:
    backgroundColor: "{colors.orangle}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.button}"
    padding: "16px 20px"
    height: "52px"
  button-ghost:
    backgroundColor: "#00000055"
    textColor: "#ffffff"
    typography: "{typography.body}"
    rounded: "{rounded.button}"
    padding: "16px 20px"
    height: "48px"
  guide-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "2px"
    padding: "14px 16px 8px"
  guide-channel-badge:
    backgroundColor: "{colors.ink}"
    textColor: "#ffffff"
    typography: "{typography.pixel}"
    rounded: "{rounded.chip}"
    padding: "10px 0"
    width: "42px"
  tape-label:
    backgroundColor: "{colors.tape-cream}"
    textColor: "{colors.ink}"
    typography: "{typography.pixel}"
    rounded: "{rounded.hairline}"
    padding: "6px 7px 5px"
  section-tag:
    textColor: "#c99a63"
    typography: "{typography.pixel}"
    rounded: "{rounded.chip}"
    padding: "6px 8px"
---

# Design System: patpadgett.com — The Bedroom, 1988

## Overview

**Creative North Star: "The Bedroom, 1988"**

The page is a kid's bedroom on a Saturday morning, and every object in it is doing a job. The woodgrain console TV is the front door; its TV Guide is the plain-language table of contents; the Space Command remote and the channel knob are the same routes as toys. The NES shelf, the VHS clamshell, the cassette, the coffee-table magazines, the Madballs, the Color Classic, the library hardcover and the Garbage Pail wax pack each hold one piece of real content — music, bio, work history, interests, the book, contact. Nothing is a decoration with content bolted on; the content is set into the object.

Objects are photographs, not CSS drawings: gpt-image-2 plates on transparent backgrounds (assets/plates/*.webp, assets/toys/*.webp, assets/octavitin/*.webp), with live HTML positioned onto measured regions of each plate. Text on wood is cream; text on the CRT glows; text on paper is ink in a typewriter or pixel face. The whole page is dark walnut with a fixed grain, dimmed by a radial vignette so cream type reads.

Density is high on purpose, but the hierarchy is fixed: identity on the glass first, the cream guide second, everything else is exploration. The remote control and the channel knob were tried and retired (2026-09-20): the pushbutton row on the set does their job without a second object. Motion switches were retired too; the room honours `prefers-reduced-motion` and otherwise moves. The one confirmed anti-reference is the earlier "acid-yellow / ink vat" hub and any generic retro-template look — neon-on-black gradients, floating tags, imported stock bedroom photos.

**Key Characteristics:**
- Photoreal plates with measured content boxes; regenerate a plate → re-measure its box.
- Woodgrain everywhere; phosphor glow only inside the glass.
- Four house faces with strict jobs (cartoon display, pixel labels, terminal, reading body) plus two guest faces owned by their sections (Brygada for the book, Courier Prime for the printout).
- Motion is mechanical: steps, snaps, detents, one authored moment per object. Nothing eases in for decoration.
- Every toy control has a plain-language twin (guide row, caption, aria-label).

## Colors

A dark walnut room lit by a cream TV Guide, with 1980s pastel-and-neon accents used as flat fields, never gradients.

### Primary
- **Walnut Room** (`{colors.walnut-room}`): the body, under a fixed grain plate and vignette. Everything sits on this.
- **Cream** (`{colors.cream}`): all type on wood — headings, ledes, captions.
- **Paper** (`{colors.paper}`): the TV Guide card; the only large light surface in the hero.
- **Ink** (`{colors.ink}`): type on paper, kraft and tape; the channel badge fill.

### Secondary
- **Slime** (`{colors.slime}`): the primary button, focus rings, Channel 4's bumper text. Green is "go".
- **Yellow** (`{colors.yellow}`): skip link, Madball name tags, the ledger CTA.
- **Countach Red** (`{colors.countach-red}`): POWER, Channel 3, TONIGHT on the library card. Tape-label red `#b71212` (POWER ink, TV GUIDE head, the About Patrick eyebrow) is its ink-on-paper form.
- **Cyan** (`{colors.cyan}`): the set's status line; Channel 5's bumper.
- **Pink, Lavender, Peach** (`{colors.pink}`, `{colors.lavender}`, `{colors.peach}`): flat sticker and card fields only.

### Tertiary (section-owned)
- **Book Navy + Orangle** (`{colors.book-navy}`, `{colors.orangle}`): Octavitin's cover, bumper 6, the book CTA. Orangle is the book's slime.
- **Card Cream + Kraft** (`{colors.card-cream}`, `{colors.kraft}`): library card and pocket.
- **Tape Cream** (`{colors.tape-cream}`): masking-tape labels (library card pocket, stickers).
- **DOS Blue + DOS Yellow** (`{colors.dos-blue}`, `{colors.dos-yellow}`): bumper 7 and the ledger — grime95's own terminal palette.
- **Green-bar Paper + Band** (`{colors.greenbar-paper}`, `{colors.greenbar-band}`): the dot-matrix printout.

### Neutral
- **CRT Black** (`{colors.crt-black}`): the glass at rest; the only true black.
- Grey plastic for cartridges and knob comes from the plates, not tokens.

### Named Rules
**The Phosphor Rule.** Glow (text-shadow, box-shadow blur) is allowed only inside `.tv__glass`, on the pilot lamp and the Mac screen. The book cover's title and author use stacked hard offsets, not blur. Everywhere else, shadows are hard offsets (`4px 4px 0 #000`, `0 5px 0 <darker>`).
**The Flat Field Rule.** Accents are solid fills. No gradients except material ones — woodgrain, cartridge ridges, green-bar paper, the knob's radial plastic.

## Typography

**Display Font:** Bangers (with Impact, sans-serif)
**Label/Pixel Font:** Press Start 2P (monospace)
**Terminal Font:** VT323 (monospace)
**Body Font:** Nunito variable 300–900 (system-ui, sans-serif)
**Section guests:** Brygada 1918 (the book, its card, the reader; woff2 latin subset ~12KB each with TTF fallback), Courier Prime + Doto (the printout)

All self-hosted in assets/fonts, latin subset only.

**Character:** cartoon shout for headings, arcade pixel for anything that labels a control, green-screen terminal for anything a computer typed, and a friendly rounded sans for reading. The pairing reads as "kid's stuff that works".

### Hierarchy
- **Display** (400, `clamp(42px,6vw,84px)`, 0.9): section headings, "Get in touch", with a 4px hard black shadow. The TV title is the same face at `clamp(30px,6vw,96px)`.
- **Book title** (700, `clamp(36px,4vw,54px)`, 0.95, −0.03em): Octavitin's title on the pitch and the cover only.
- **Lede** (400, 19px, 1.5, Nunito): one line under each heading, ≤60ch.
- **Body** (400, 17px, 1.5, Nunito): prose; the reader uses Brygada at 17–19px on cream.
- **Label** (400, 11px, 1, Press Start 2P): tape labels, shelf captions, section tags, guide head. 11px is the floor for anything functional.
- **Terminal** (400, 15px/1.6, VT323): the library card's typewriter lines, the Mac screens, the remote status.
- **Micro** (6–9px, Press Start 2P / Nunito 800): engraving only — SPACE COMMAND, ON/OFF, cartridge band subtitles. Never the sole carrier of meaning.

### Named Rules
**The Twin Label Rule.** Anything set below 11px must have a ≥11px twin that says the same thing (shelf caption, guide description, aria-label).

## Layout

`.room` is a 1320px column with `clamp(12px,3vw,40px)` gutters. The hero (`.set`) is a two-column grid, `1.9fr / minmax(320px,.95fr)` — TV | guide — then the bio row (`.who`), then the cartridge shelf (five carts, `repeat(5, minmax(0,170px))`). DOM order is TV → guide → bio → shelf, and both layouts render in that order, so keyboard order follows reading order everywhere.

Sections stack with `clamp(48px,7vw,90px)` top padding and open with a section tag whose number matches the channel: Work PP-003, Music PP-004, Bedtime PP-006, grime95 PP-007, then the coffee table PP-008 and Madballs PP-009 (PP-005 is BLOG, which lives off-page; the About sleeve carries no tag — it is not a channel, it simply follows the set) beside the display heading and one lede line. Page order = channel order: About Patrick (VHS sleeve + bio), Work (Mac + log), Music (cassette), Octavitin (pitch | book | card, `0.75fr / 1.2fr / 0.7fr`), Booking records (Polaroid stack | printer), the coffee table (magazine fan), Madballs (3×3), Contact (five GPK cards under the wax pack). The About sleeve leads untagged; section codes follow channel numbers (003, 004, 006, 007) and continue 008, 009.

Breakpoints: ≤1000px the hero goes single-column (TV capped at 560px, then guide, then bio, then shelf) so the whole guide fits the first screen and the person is the second screen; ≤960px sections collapse to one column and the book section becomes pitch → CTA → book → card; ≤640px the shelf is 3+2 (compact, ~400px), pack 2-up; the bio's lead paragraph sits above the VHS sleeve; ≤380px knob 72px; ≤340px the TV title drops a size. No horizontal overflow at 320/390/1024/1440 (the coffee-table fan is intentionally clipped).

Measured plate boxes (percent of plate): TV glass 11.5/14/62/65, pushbutton rail 6/87.2/71.5/5.6, pilot lamp 89.9/38.5 ⌀1.3; cartridge label recess 40.5/13.5/44.5/53.5; remote keys at 17/29.1/41.2/53.2/65.3/77.4% height (seven-button plate: 18/29/40/51/62/73/84), MOTION switch at 96.5%; book cover face 6/2.5/90/95; printer slot x 13→87%.

## Elevation & Depth

Hybrid, by material. Objects cast one soft drop-shadow onto the wood (`filter: drop-shadow(0 26px 22px rgba(0,0,0,.7))` on the remote and plates) because they are things on a floor. Paper and tape cast hard, short offsets (`1px 2px 0 rgba(0,0,0,.55)`) because they are flat. Type on wood carries a hard 4px black shadow; buttons a 5px "3D" base that compresses 2px on hover. Inside the glass, depth is glow and vignette (`inset 0 0 40px #000`). Nothing floats; nothing has a diffuse UI shadow.

### Shadow Vocabulary
- **Object on floor** (`drop-shadow(0 26px 22px rgba(0,0,0,.7))`): photoreal plates.
- **Paper on plate** (`1px 2px 0 rgba(0,0,0,.55)`): tape labels, stickers.
- **Lettering on wood** (`4px 4px 0 #000`): display headings.
- **Button base** (`0 5px 0 <darker of fill>`, hover `0 3px 0` + `translateY(2px)`): all buttons.
- **Glass** (`inset 0 0 40px #000, inset 0 0 4px #ffffff22`): the CRT.

### Named Rules
**The Press Rule.** Anything pressable moves down when pressed — buttons 2px, the set's pushbuttons 2px with an inset shadow. Hover never lifts UI; it only brightens.

## Shapes

Corners follow the material: tape and paper are near-square (1–2px), plastic chips and badges 3px, buttons 6px, knobs and lamps circles. Plates bring their own silhouettes — the CRT is `9% / 12%` rounded-rect, the book's spine edge `2px 5px 5px 2px`. Borders are used as material edges (the ghost button's 3px cream frame, the section tag's 2px outline), never as dividers; dividers on paper are ruled lines (`#bfb298`, `#d7c7a4`).

## Components

Tactile and toy-like: every control is a physical thing you press, and every one has a plain-language twin.

### Buttons
- **Shape:** softly rounded (6px), 48px min height, Nunito 900 16px.
- **Primary (`.btn--slime`):** slime fill, black text, `0 5px 0 #1a7a08` base. Book section swaps to orangle on ink with an `#8a4a1a` base.
- **Hover:** drops 2px, base shortens to 3px. Focus: 4px slime outline, 3px offset (global).
- **Ghost (`.btn--ghost`):** translucent black, 3px cream border; hover fills cream with black text.

### TV Guide (signature)
Cream paper card (2px corners) with a pixel head. Each row: a 42px ink badge with the channel number in Press Start 2P 24px, a bold title, a 13px description that names the real destination and says "fiction" where it applies. Six equal rows in channel order under three flag sub-heads set on the divider rule (pixel 9px, `#8a6a3a`): THE SITES — 3 WORK, 4 MUSIC, 5 BLOG; IN THIS ROOM — 6 BEDTIME BOOK, 7 GRIME95; SAY HI — ✉ CONTACT. Every badge ink; the tuned channel's badge red with `aria-current`. For the three sites the address is its own third line in VT323 15px `#745628` (`.guide__dom--url`), a station ID under the listing rather than a wrapped sentence. On phones the destination tails (`.guide__dom`) hide so every description is one line and the whole card including the Email row fits 390×844. Rows are real links (external for 3/4/5, in-page for 6/7/CONTACT) and navigate immediately — the tuning theatre belongs to the set's buttons. Under CONTACT sits a plain `Email Patrick → pat@patpadgett.com` mailto row (44px). Hover underlines the title in pink, 3px.

### Channel buttons (signature)
Seven round pushbuttons set into the wood rail under the glass (channels are real `<a href>` styled as keys, so modifier-clicks work natively; POWER/MUTE are buttons with 11px Nunito 800 labels) (`.tvkeys` at 6/87.2% of the TV plate, 71.5% wide): POWER (red), 3 WORK, 4 MUSIC, 5 BLOG, 6 BEDTIME, 7 GRIME95, MUTE (green when playing). Each is a ≥44px target with a cream pixel label (6–8px engraving; the TV Guide row is its 11px+ twin). A channel press shows the bumper for 700ms then tunes in; Escape cancels. POWER kills the set (glass collapses, buttons dim); MUTE starts/stops the soundtrack. Status line in cyan VT323 under the cabinet. On phones the row hangs absolutely below the cabinet (`top:100%`) as a 7-up grid, 64px rows, numeral stacked over the name; the bumper is a button while active (tap or Esc cancels) and a cancelled tune restores the previously committed channel — no channel is highlighted until one is pressed. MUTE with the set off powers it on first.

### Cartridges
Grey plate; label recess holds 8-bit box art (assets/carts/label-*.webp) over a black→dark-red band with a cream title (Nunito 900, wraps on words) and a gold subtitle. Above the shelf an ON THIS PAGE hint in pixel 11px (`#c99a63`); below each cart a plain shelf caption in pixel 11px (WORK STORY · THE BOOK · THE RECORD · MAGAZINES · MADBALLS) so on-page routes never share a label with the guide's external doors. Hover lifts 12px in 3 steps. aria-label names the destination and "on this page".

### Library card + pocket
Cream ruled card (24px rule, VT323 15px, typewriter voice) tucked into a kraft pocket with a thumb notch; blue date stamps, cursive borrowers, TONIGHT in red. The last stamped row clears the pocket lip by ≥18px.

### Reader dialog
Native `<dialog>`; a two-page spread on desktop (illustration | chapter), one scrolling cream column on phones. Brygada 1918 prose with a drop-cap, a pixel "Scroll to read ↓" cue on its own line that fades after 24px, a toolbar with a 44px resume note, Close, and reading position kept per paragraph in localStorage.

### Section tag
Outlined chip (`#c99a63`, 2px, 3px corners) with the PP-00n catalogue code in pixel 11px, baseline-aligned beside the heading.

## Do's and Don'ts

### Do:
- **Do** set real content into a measured region of a photoreal plate; re-measure after regenerating any plate.
- **Do** give every toy control a plain twin: a guide row, a shelf caption, an aria-label that names the destination.
- **Do** use steps, snaps and detents for motion (`steps(n)`, `cubic-bezier(.16,1,.3,1)` for settles); gate every loop with `.js:not(.static)` so MOTION and reduced-motion stop it.
- **Do** keep 11px Press Start 2P as the floor for functional labels; anything smaller is engraving.
- **Do** cast hard shadows on wood (`4px 4px 0 #000`) and soft drop-shadows only under objects.
- **Do** push real `#hash` history for in-page channel navigation so Back and copied links work.

### Don't:
- **Don't** glow outside the glass — no text-shadow blur on wood, no diffuse box-shadows on UI.
- **Don't** add a gradient that isn't a material (woodgrain, ridges, green-bar, plastic).
- **Don't** ease-in-and-rise, parallax, or scroll-reveal sections; the world is mechanical, not cinematic.
- **Don't** import a photographed room or a stock retro backdrop; the room is built from objects on walnut.
- **Don't** write internal or process copy into the page (design notes, "made to look like", provenance); provenance lives here and in the footer's one line.
- **Don't** bounce anything; settles use `cubic-bezier(.16,1,.3,1)`.

<!-- Detector exceptions (world, not defects): repeating-gradient stripes = woodgrain / cartridge ridges / green-bar; glow text-shadows inside .tv__glass and .mac__glass = phosphor; .smoke i "marquee" = ashtray smoke; .table clipped container = the magazine fan; low-contrast reads of cassette/cartridge overlay text = static reads against body colour, actual backgrounds are the plate bands; .mag transition:width = magazine lift (pre-existing). -->
