"""Pixel-scan the printer plate: locate the dark carriage bay (platen) band and its horizontal extent, as % of the plate."""
import statistics, sys
from PIL import Image
path = sys.argv[1] if len(sys.argv) > 1 else 'assets/plates/printer.webp'
im = Image.open(path).convert('RGBA')
W, H = im.size
print('plate', W, H, 'alpha corner', im.getpixel((2, 2))[3])
px = im.load()
rows = []
for y in range(H):
    vals = []
    for x in range(int(W * 0.30), int(W * 0.70), 4):
        r, g, b, a = px[x, y]
        if a > 128:
            vals.append(0.2126 * r + 0.7152 * g + 0.0722 * b)
    rows.append(statistics.mean(vals) if vals else None)
op = [y for y, l in enumerate(rows) if l is not None]
print('opaque rows', op[0], op[-1], f'{op[0]/H*100:.1f}%..{op[-1]/H*100:.1f}%')
for y in range(0, H, max(1, H // 40)):
    l = rows[y]
    print(f'{y:5d} {y/H*100:5.1f}%  lum={"-" if l is None else round(l)}')
dark = [y for y, l in enumerate(rows) if l is not None and l < 70]
groups = []
if dark:
    s = p = dark[0]
    for y in dark[1:]:
        if y != p + 1:
            groups.append((s, p)); s = y
        p = y
    groups.append((s, p))
print('dark bands (lum<70) in centre columns:', [(a, b, f'{a/H*100:.1f}-{b/H*100:.1f}%') for a, b in groups if b - a > 3])
if groups:
    a, b = max(groups, key=lambda g: g[1] - g[0]); ymid = (a + b) // 2
    xs = [x for x in range(W) if px[x, ymid][3] > 128 and (0.2126 * px[x, ymid][0] + 0.7152 * px[x, ymid][1] + 0.0722 * px[x, ymid][2]) < 70]
    if xs:
        print('bay row', ymid, f'{ymid/H*100:.1f}%', 'dark x-extent', xs[0], xs[-1], f'{xs[0]/W*100:.1f}%..{xs[-1]/W*100:.1f}%')
# opaque horizontal extent at several heights (the housing silhouette)
for pct in (0.05, 0.15, 0.25, 0.35, 0.5, 0.7, 0.9):
    y = int(H * pct)
    xs = [x for x in range(W) if px[x, y][3] > 128]
    print(f'y={pct*100:.0f}% opaque x {xs[0] if xs else "-"}..{xs[-1] if xs else "-"}', f'({xs[0]/W*100:.1f}%..{xs[-1]/W*100:.1f}%)' if xs else '')
