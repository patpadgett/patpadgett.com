---
target: the Octavitin section
total_score: 26
max_score: 32
na_heuristics: 9,10
p0_count: 0
p1_count: 0
target_identity: "file:/data/pat/2_PUBLISHED/patpadgett.com/index.html#octavitin"
timestamp: 2026-09-19T02-45-51Z
slug: index-html-octavitin
---
# Critique — index.html#octavitin (re-run after fix pass, commit acf7319)

Method: dual-agent (A: sa-0-e9a8a6f1 · B: sa-1-3651bf4f). Mode: Persuade with embedded Read surface.

## Design Health Score — 26/32 (heuristics 9, 10 n/a)

| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility of System Status | 3 | Resumed position not announced |
| 2 | Match System / Real World | 4 | Metaphor, age line, synopsis land |
| 3 | User Control and Freedom | 4 | Close/Esc/opener focus/Start again verified |
| 4 | Consistency and Standards | 3 | ▶ implies media; text CTAs lack dialog semantics |
| 5 | Error Prevention | 3 | Position survives close, not reload |
| 6 | Recognition Rather Than Recall | 3 | Chapter end lacks book-site route |
| 7 | Flexibility and Efficiency | 3 | Keyboard scroll, resume, restart; no cross-reload bookmark |
| 8 | Aesthetic and Minimalist Design | 3 | Reader toolbar louder than prose |
| 9 | Error Recovery | n/a | static surface, no error states |
| 10 | Help and Documentation | n/a | not warranted |

All previous P1s closed (LATE badge renders; Tab→chapter region, PageDown scrolls; mobile pitch above cover; opener focus restore; resume + Start again).

## Design Specificity Verdict
Strongly product-specific. octavitin.css detector: exit 0, []. index.html: 34 page-wide, none section-attributable. Browser: 0 errors, no section overflow, reduced-motion/no-JS pass, contrast ≥5.3:1 on solid pairs.

## Priority Issues
- [P2] Chapter end lacks link to the book's site → add primary end link; poster secondary; Start again tertiary. (/impeccable clarify)
- [P2] Resume state invisible, session-only → "Picking up where you left off · Start again" indicator; decide localStorage. (/impeccable harden)
- [P2] ▶ glyph reads as play; text CTAs lack aria-haspopup/aria-controls → change glyph, add attrs. (/impeccable clarify)
- [P3] .reader__bar span styles nested close-button span; drop cap gap → scope selector, tighten. (/impeccable typeset)

## Persona Red Flags
- Parent on phone: play icon; unexplained resume; no book-info route at end.
- Recruiter: none blocking.
- Keyboard/SR: passes; text CTAs should announce dialog; facing page aria-hidden.

## Minor
- No meta copy. Mobile author line breaks mid-name. 7px/10px cover lettering is object text. DESIGN.md has no Octavitin entry.

## Questions
- Primary next step at the sample's end: book site, more reading, or poster?
- Persist reading position across reloads?
- Next pass: reading-state guidance, CTA semantics/labels, or typography?
