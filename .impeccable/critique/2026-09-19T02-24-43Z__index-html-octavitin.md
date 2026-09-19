---
target: the Octavitin section
total_score: 23
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 3
target_identity: "file:/data/pat/2_PUBLISHED/patpadgett.com/index.html#octavitin"
timestamp: 2026-09-19T02-24-43Z
slug: index-html-octavitin
---
# Critique — index.html#octavitin (PP-005 Bedtime reading + #reader)

Method: dual-agent (A: sa-0-835052fd · B: sa-1-525eee20). Mode: Persuade with embedded Read surface.

## Design Health Score — 23/32 (heuristics 7, 10 n/a)

| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility of System Status | 3 | No cue that only the right page scrolls on desktop |
| 2 | Match System / Real World | 4 | Library hardcover / date-due card / flashlight metaphor coherent |
| 3 | User Control and Freedom | 3 | Close after opening from #read-btn returns focus to #book |
| 4 | Consistency and Standards | 3 | Reopen resets on desktop, keeps position on mobile |
| 5 | Error Prevention | 3 | Tab from Close skips chapter to final link |
| 6 | Recognition Rather Than Recall | 3 | Mobile: age + CTA below fold; "Take Parker's Rules home" unclear |
| 7 | Flexibility and Efficiency | n/a | short promotional sample |
| 8 | Aesthetic and Minimalist Design | 2 | Mobile first viewport all props; card y≈834, CTA y≈1303 |
| 9 | Error Recovery | 2 | Accidental close loses place (desktop) / lands at end (mobile) |
| 10 | Help and Documentation | n/a | not warranted |

## Design Specificity Verdict
Strongly authored, not interchangeable. Detector: index.html 33 findings, 0 attributable to the section; octavitin.css []. Browser: 0 errors, no section overflow, dialog/keyboard/reduced-motion/no-JS verified; contrast passes AA on solid backgrounds. Overlay: injected (38 found in console), overlay elements not verified.

## Priority Issues
- [P1] `.guide__late b` background var(--navy) undefined outside .sec--octavitin/.reader → white on cream. Fix: define --navy at :root.
- [P1] Keyboard path bypasses chapter: Close → Tab → end link. Fix: focusable scroll region between Close and final link.
- [P1] Mobile: book+flashlight fill first viewport; age line + button below fold. Fix: title/age/button under lede on ≤960px; shrink flashlight reserve.
- [P2] Reopen state inconsistent (JS resets .page--right; mobile scrolls .reader__spread); focus restore hard-coded to #book. Fix: store opener; one scroll policy.
- [P2] "Take Parker's Rules home" doesn't name the free printable poster. Fix: "Print Parker's Rules (free poster)".

## Persona Red Flags
- Parent on phone: CTA/age below fold; reopen may land at end; vague final link.
- Recruiter: authorship/audience arrive late on mobile.
- Keyboard/SR: Tab skips chapter; wrong focus restore; left-page illustration aria-hidden.

## Minor
- Tiny type: .book__call 7px, .book__author 9px, .due__head small 9–10px, .reader__bar span 10–11px.
- Reader bar title wraps on mobile.
- No meta copy found. Clipped last line is scroll content.
- Cognitive load 2/8 failures (moderate).

## Questions
- Phone first screen: story or object?
- Reopen: bookmark or fresh sample?
- Sample's ending: more reading, book site, or printable?
