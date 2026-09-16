# patpadgett.com — personal homepage

Simple one-page HTML/CSS homepage with Music, Résumé, Blog, email, GitHub, and LinkedIn. No JavaScript, analytics, trackers, build dependencies, or remote font requests. Existing websites untouched; not deployed.

## Files
- index.html + styles.css + assets/manrope.woff2: static deployment files.
- patpadgett-home.html: standalone version with embedded CSS and font; works offline except outbound links.
- assets/OFL.txt: Manrope license; source Google Fonts https://github.com/google/fonts/tree/main/ofl/manrope . Downloaded from fonts.gstatic.com.
- .impeccable/: local QA evidence and development-only direction notes. Do not deploy.
- PRODUCT.md / DESIGN.md / REVIEW.md: development documentation. Do not deploy.

## Link checks
User-specified destination URLs retained exactly. On this build's network checks, blog.patpadgett.com returned HTTP 200. music.patpadgett.com and resume.patpadgett.com failed DNS resolution. Both need DNS/hosting configuration before visitors can reach them. No alternative destination silently substituted.

## Verification
Chromium at widths 320, 390 and 1440: one h1, no horizontal overflow, no JS errors, font loaded, keyboard first tab reaches Music, every link at least 44px high. Mobile and desktop screenshots visually inspected. Chromium emulation is not a physical iPhone/Safari test. Impeccable detector skipped due to documented broken installation.

## Publishing
Upload only index.html, styles.css and assets/ to the selected static host, or use the standalone file renamed index.html. Configure the two missing subdomains with their real hosting targets; do not guess DNS targets. Publishing and DNS changes require separate authorization.
