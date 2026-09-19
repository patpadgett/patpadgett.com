---
target: the Octavitin section
total_score: 26
max_score: 32
na_heuristics: 9,10
p0_count: 0
p1_count: 1
target_identity: "file:/data/pat/2_PUBLISHED/patpadgett.com/index.html#octavitin"
timestamp: 2026-09-19T02-58-58Z
slug: index-html-octavitin
---
# Critique — index.html#octavitin (run 3, commit 1ffc339)

Method: dual-agent (A: sa-0-5ab2305c · B: sa-1-a55639e2). Mode: Persuade + embedded Read.

## Design Health Score — 26/32 (9, 10 n/a)

| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility of System Status | 3 | Resume banner persists too long; no remaining-length cue |
| 2 | Match System / Real World | 4 | Coherent book/library metaphor |
| 3 | User Control and Freedom | 3 | Resume banner has no keep-place dismiss |
| 4 | Consistency and Standards | 4 | All CTAs share dialog semantics |
| 5 | Error Prevention | 3 | Pixel bookmark drifts on reflow (700→729/779) |
| 6 | Recognition Rather Than Recall | 3 | End CTA vague |
| 7 | Flexibility and Efficiency | 3 | Keyboard, entry points, bookmark; no text size |
| 8 | Aesthetic and Minimalist Design | 3 | Sticky banner competes with prose |
| 9 | Error Recovery | n/a | |
| 10 | Help and Documentation | n/a | |

## Verdict
Specific to the page world. octavitin.css detector: 0. index.html: 34 page-wide, none section-attributable (8.8px cover subtitle is object lettering). Browser: 0 errors, no overflow, aria on CTAs, contrast 6.8–13.4:1, reload resume works.

## Priority Issues
- [P1] Sticky resume banner inside prose, never leaves without restart → move to .reader__bar, auto-hide on first scroll, anchor bookmark to paragraph index. (/impeccable harden)
- [P2] Mobile props before premise; title small → add title + one synopsis line to .pitch. (/impeccable layout)
- [P2] End CTA vague, wraps → "Explore the book ↗". (/impeccable clarify)
- [P2] Resume not announced to AT → role="status". (/impeccable harden)

## Persona Red Flags
- Parent: premise delayed; banner eats space; ending vague.
- Recruiter: heading outranks book title on mobile.
- Keyboard/SR: no trap; resume unannounced; stamps list read aloud.

## Minor
- 41px secondary targets; stranded "·" on wrap; 10–12px small print; DESIGN.md undocumented.

## Questions
- Resume notice: toolbar line, or vanish after first scroll?
- Mobile: title + premise above CTA, or synopsis ahead of props?
- Ending: explore the book, or the poster?
