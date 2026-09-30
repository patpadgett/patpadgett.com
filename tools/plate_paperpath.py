"""Pixel-scan the printer plate for the paper path: bail rollers (light blobs in the bay), tractor sprocket
columns, bay x-extent. Prints % of plate width/height so grime.css can mount the paper on them."""
import sys
from PIL import Image
path = sys.argv[1] if len(sys.argv) > 1 else 'assets/plates/printer.webp'
im = Image.open(path).convert('RGBA'); W, H = im.size; px = im.load()
def lum(p): return 0.2126 * p[0] + 0.7152 * p[1] + 0.0722 * p[2]
# 1. bail rollers: light pixels (lum>110) inside the black bay band y 29..36%, x 22..78% (between the tractors)
ys = {}
for y in range(int(H * .29), int(H * .37)):
    n = sum(1 for x in range(int(W * .22), int(W * .78)) if px[x, y][3] > 128 and lum(px[x, y]) > 110)
    ys[y] = n
rows = [(y, n) for y, n in ys.items() if n > 6]
if rows:
    print('bail-roller light rows: %.1f%% .. %.1f%%' % (rows[0][0] / H * 100, rows[-1][0] / H * 100))
for y in range(int(H * .29), int(H * .37), max(1, H // 200)):
    print('  y %.1f%%  light px %d' % (y / H * 100, ys[y]))
# 2. platen rubber: very dark rows (mean lum<45) in x 25..75% below the bail
print('mean lum per row 28..50%:')
for y in range(int(H * .28), int(H * .50), max(1, H // 100)):
    vals = [lum(px[x, y]) for x in range(int(W * .25), int(W * .75), 3) if px[x, y][3] > 128]
    print('  y %.1f%%  lum %d' % (y / H * 100, sum(vals) / len(vals) if vals else -1))
# 3. tractor sprockets: metal (lum>140) columns inside the bay band y 31..44%, x 12..24% and 76..90%
for lo, hi, name in ((.12, .24, 'left'), (.76, .90, 'right')):
    cols = {}
    for x in range(int(W * lo), int(W * hi)):
        cols[x] = sum(1 for y in range(int(H * .31), int(H * .45)) if px[x, y][3] > 128 and lum(px[x, y]) > 140)
    best = sorted(cols.items(), key=lambda kv: -kv[1])[:12]
    xs = sorted(x for x, n in best if n > 4)
    if xs:
        print('%s sprocket bright columns %.1f%%..%.1f%% (centre %.1f%%)' % (name, xs[0] / W * 100, xs[-1] / W * 100, (xs[0] + xs[-1]) / 2 / W * 100))
# 4. bay x-extent at y=33% (dark run)
y = int(H * .33)
xs = [x for x in range(W) if px[x, y][3] > 128 and lum(px[x, y]) < 70]
print('bay dark x-extent at 33%%: %.1f%%..%.1f%%' % (xs[0] / W * 100, xs[-1] / W * 100))
