#!/usr/bin/env python3
"""patpadgett.com hub: mention the 2026 open-source tools in the bio + add their SoftwareApplication JSON-LD.
Idempotent. Run: python3 tools/add_projects_2026.py"""
import json, re, pathlib
ROOT = pathlib.Path("/data/pat/2_PUBLISHED/patpadgett.com")
P = ROOT / "index.html"
h = P.read_text()
orig = h

OLD_P = ('its own Wikipedia article</a>; it still ships in most distributions.</p>')
NEW_P = ('its own Wikipedia article</a>; it still ships in most distributions. '
         'In 2026 I added three small Linux tools, each a single Python file with tests and no dependencies: '
         '<a href="https://github.com/patpadgett/undo">undo</a>, a shell undo button that remembers how to reverse '
         'mv, cp, rm, chmod and friends; <a href="https://github.com/patpadgett/whom">whom</a>, which ranks who to ask '
         'about a file from git history and guesses whether they are awake; and '
         '<a href="https://github.com/patpadgett/huh">huh</a>, which tells you what a pasted string is '
         '(epoch, JWT, cron line, chmod mode, exit code...) and the one-liner that would have told you.</p>')
if OLD_P in h and "github.com/patpadgett/huh" not in h:
    h = h.replace(OLD_P, NEW_P, 1)

# JSON-LD: one SoftwareApplication block per tool, after corkscrew's block
blocks = list(re.finditer(r'<script type="application/ld\+json">(.*?)</script>', h, re.S))
ck = next(b for b in blocks if '"name": "corkscrew"' in b.group(1) or '"name":"corkscrew"' in b.group(1))
author = {"@type": "Person", "name": "Patrick Padgett", "url": "https://patpadgett.com/"}
TOOLS = [
    ("undo", "https://github.com/patpadgett/undo", None,
     "The shell undo button: journal-of-inverses wrappers for mv, cp, rm, chmod, chown, ln, mkdir and rmdir."),
    ("whom", "https://github.com/patpadgett/whom", "https://pypi.org/project/whom-cli/",
     "Who to ask about this file, and are they awake: contributor ranking and local-time inference from git history."),
    ("huh", "https://github.com/patpadgett/huh", "https://pypi.org/project/whatsthis/",
     "What is this string? Ranked readings of timestamps, tokens, cron lines, modes, hashes, colours and addresses, offline."),
]
add = ""
for name, url, same, desc in TOOLS:
    if f'"url": "{url}"' in h or f'"url":"{url}"' in h:
        continue
    d = {"@context": "https://schema.org", "@type": "SoftwareApplication", "name": name, "url": url,
         "applicationCategory": "DeveloperApplication", "operatingSystem": "Linux, BSD, macOS", "datePublished": "2026",
         "programmingLanguage": "Python", "license": "https://opensource.org/licenses/MIT", "description": desc, "author": author}
    if same:
        d["sameAs"] = same
    add += '\n<script type="application/ld+json">' + json.dumps(d, ensure_ascii=False) + '</script>'
if add:
    h = h[:ck.end()] + add + h[ck.end():]

# Person.knowsAbout gains the tools lane
m = next(b for b in re.finditer(r'<script type="application/ld\+json">(.*?)</script>', h, re.S) if '"@type": "Person"' in b.group(1)[:80] or '"@type":"Person"' in b.group(1)[:80])
person = json.loads(m.group(1))
ka = person.setdefault("knowsAbout", [])
for k in ("Linux systems administration", "Python command-line tools"):
    if k not in ka:
        ka.append(k)
h = h[:m.start(1)] + json.dumps(person, ensure_ascii=False) + h[m.end(1):]

assert "***" not in h
for b in re.findall(r'<script type="application/ld\+json">(.*?)</script>', h, re.S):
    json.loads(b)
assert h.count("github.com/patpadgett/huh") >= 2
if h != orig:
    P.write_text(h)
    print("written", len(orig), "->", len(h))
else:
    print("no change")
