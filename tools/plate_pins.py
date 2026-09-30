"""Locate the tractor pin columns on the printer plate: grey metal (low saturation, mid luminance) inside the bay band,
excluding beige housing (R-B > 25) and black rubber (lum < 90). Prints x-extent and centre as % of plate width."""
import sys
from PIL import Image
path = sys.argv[1] if len(sys.argv) > 1 else 'assets/plates/printer.webp'
im = Image.open(path).convert('RGBA'); W, H = im.size; px = im.load()
def lum(p): return 0.2126 * p[0] + 0.7152 * p[1] + 0.0722 * p[2]
y0, y1 = int(H * .31), int(H * .45)
for lo, hi, name in ((.10, .30, 'left'), (.70, .93, 'right')):
    score = {}
    for x in range(int(W * lo), int(W * hi)):
        n = 0
        for y in range(y0, y1):
            p = px[x, y]
            if p[3] > 128 and 90 < lum(p) < 235 and abs(p[0] - p[2]) < 22 and abs(p[0] - p[1]) < 16:
                n += 1
        score[x] = n
    xs = [x for x, n in score.items() if n > (y1 - y0) * 0.18]
    if xs:
        # group contiguous runs
        runs, s, p = [], xs[0], xs[0]
        for x in xs[1:]:
            if x != p + 1: runs.append((s, p)); s = x
            p = x
        runs.append((s, p))
        for a, b in runs:
            if b - a >= 3:
                print('%s metal run x %.1f%%..%.1f%% (centre %.1f%%, %d px wide, peak %d rows)' % (name, a / W * 100, b / W * 100, (a + b) / 2 / W * 100, b - a, max(score[x] for x in range(a, b + 1))))
    else:
        print(name, 'no metal columns found')
