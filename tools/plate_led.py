"""Find the amber PAPER OUT LED on the printer plate (control panel region) as % of plate."""
import sys
from PIL import Image
path = sys.argv[1] if len(sys.argv) > 1 else 'assets/plates/printer.webp'
im = Image.open(path).convert('RGBA'); W, H = im.size; px = im.load()
hits = []
for y in range(int(H * .55), int(H * .85)):
    for x in range(int(W * .55), int(W * .98)):
        r, g, b, a = px[x, y]
        if a > 128 and r > 190 and 90 < g < 200 and b < 90 and r - g > 40:   # amber/orange
            hits.append((x, y))
print('amber px:', len(hits))
if hits:
    xs = [h[0] for h in hits]; ys = [h[1] for h in hits]
    print('amber bbox x %.1f..%.1f%%  y %.1f..%.1f%%  centre (%.1f%%, %.1f%%)' % (min(xs) / W * 100, max(xs) / W * 100, min(ys) / H * 100, max(ys) / H * 100, (min(xs) + max(xs)) / 2 / W * 100, (min(ys) + max(ys)) / 2 / H * 100))
# green LED too, for reference
g2 = [(x, y) for y in range(int(H * .55), int(H * .85)) for x in range(int(W * .55), int(W * .98)) if px[x, y][3] > 128 and px[x, y][1] > 170 and px[x, y][0] < 140 and px[x, y][2] < 140]
if g2:
    xs = [h[0] for h in g2]; ys = [h[1] for h in g2]
    print('green bbox x %.1f..%.1f%%  y %.1f..%.1f%%' % (min(xs) / W * 100, max(xs) / W * 100, min(ys) / H * 100, max(ys) / H * 100))
# panel colour next to the amber LED (for the cover disc)
if hits:
    cx, cy = (min(xs) + max(xs)) // 2, (min(ys) + max(ys)) // 2
    for dx in (-30, -22, 22, 30):
        p = px[min(W - 1, max(0, cx + dx)), cy]; print('panel sample at dx', dx, p[:3])
