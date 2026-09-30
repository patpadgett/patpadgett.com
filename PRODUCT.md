# Patrick Padgett — personal homepage (patpadgett.com, "The Bedroom, 1988")

<!-- impeccable:product-schema 1 -->

## Platform
web

## Stack
Flat static HTML/CSS/JS, no build step, no runtime frameworks; self-hosted fonts. Third-party at runtime: Hotjar analytics (async), and grime95.com fetches for the booking-records section. Same convention as every patpadgett.com build.

## Users
People looking for Patrick's music, résumé, writing or contact — arriving from search, LinkedIn, GitHub, cold emails. Mobile first.

## Product Purpose
A one-page front door that routes to resume.patpadgett.com (the one-sheet résumé: PDF/DOCX/TXT), work.patpadgett.com (work story and projects), music.patpadgett.com and blog.patpadgett.com, previews the two fiction projects (Octavitin, grime95) in place, and ends with a short bio and contact. Success: the visitor picks the right door within seconds; a recruiter reaches the résumé or email in one tap from the first viewport. Live as the patpadgett.com hub since 2026-09-19 (replaced the "acid-yellow / ink vat" build, kept at /classic/). The genx.patpadgett.com staging domain no longer exists.

## Positioning
Patrick Padgett, 47, Tampa Bay FL: telecom billing mediation engineer (14 yrs Sprint Tier-3 SME), infrastructure automation (Jabil, Raymond James), author of corkscrew (2000; Linux Magazine, 2600 Vol. 19 No. 2, Wikipedia), bassist and producer (Ledakan Pemuda — Korupsi). A kid of the 1980s/90s. Early timeline: Hermes II BBS SysOp 1992 → THINK Pascal 1993 → Perl + Linux 1994 → Advertisnet 1995 (System Administrator, rural ISP selling dial-up to Lake of the Ozarks residents, supporting Macintosh clients).

## Brand commitments (owner-pinned, 2026-09-16)
Designed for and from a 1980s/1990s kid. RETRO of that period, committed: Nintendo (NES/SNES), Thrasher skateboard magazine, Faith No More, Vision Street Wear, WOODGRAIN on almost everything, pastel + neon, synthwave/retrowave, Lamborghini Countach, Ferrari Testarossa, Madballs, Garbage Pail Kids, You Can't Do That on Television, The Neverending Story, The Princess Bride, RIP Magazine, Guns N' Roses. Doors: Résumé, Work, Music, Blog, GitHub, LinkedIn, email. Same facts; no invented claims. Bio copy from the current hub may be re-voiced in period tone but stays factually identical.

## Operating Context
- Source of truth for facts: /data/pat/career/resume/master/MASTER_RESUME.md (Hindia excluded). Links: the live sub-sites listed above; verify each with a HEAD request before shipping copy that names them.
- Portrait: assets/avatar.jpg + @2x (copy from the hub).
- Image generation available (Foundry gpt-image-2) for period-style illustrations; label synthetic where mistakable for real.
- Publishes to GitHub Pages from this repo (CNAME patpadgett.com, branch main). Commit + push = deploy; verify live with curl after ~1 minute.
