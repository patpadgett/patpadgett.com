#!/usr/bin/env python3
"""110-film drugstore print, c.1988: 4:3 crop, global softness + halation, magenta-drift fade with cyan shadows,
blown warm highlights, clumpy coloured grain, uneven vignette, white print border with rounded corners, date stamp."""
import sys, numpy as np
from PIL import Image, ImageFilter, ImageEnhance, ImageDraw, ImageFont
src, dst = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('RGB')
W0, H0 = im.size
# 4:3 crop, looser: pad with blurred edges so we get more "room"
im = im.resize((960, 960), Image.LANCZOS)  # 126 Instamatic: square print
W, H = im.size
# global consumer-lens softness (f/8 fixed focus, plastic lens)
im = im.filter(ImageFilter.GaussianBlur(2.2))
im = im.filter(ImageFilter.UnsharpMask(radius=6, percent=40, threshold=2))
a = np.asarray(im).astype(np.float32) / 255.0
lum = 0.3*a[...,0] + 0.59*a[...,1] + 0.11*a[...,2]
# blow highlights warm
hi = np.clip((lum - 0.62) / 0.30, 0, 1) ** 1.4
a[...,0] += hi*0.30; a[...,1] += hi*0.22; a[...,2] += hi*0.08
# tone: lifted milky shadows
def lift(x, l, g): return (l + (1-l)*x) ** g
r = lift(a[...,0], 0.06, 0.92); g = lift(a[...,1], 0.05, 1.02); b = lift(a[...,2], 0.09, 1.12)
# dye fade: magenta drift in mids, cyan-green shadows, yellow highlights
sh = np.clip(1 - lum*2.2, 0, 1); md = np.clip(1 - np.abs(lum-0.5)*3, 0, 1)
r += 0.07*md; g -= 0.04*md; b += 0.03*md          # magenta mids
r -= 0.05*sh; g += 0.04*sh; b += 0.06*sh          # cyan/green shadows
b -= 0.10*hi; r += 0.03*hi                        # yellow highlights
a = np.clip(np.stack([r,g,b],-1), 0, 1)
mean = a.mean(-1, keepdims=True); a = mean + (a-mean)*0.88
# halation from bright regions
hal = np.asarray(Image.fromarray((hi*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(28))).astype(np.float32)/255
a[...,0] += hal*0.16; a[...,1] += hal*0.05
# chromatic fringe: shift red +2px, blue -2px away from centre
W_, H_ = a.shape[1], a.shape[0]
yy0, xx0 = np.mgrid[0:H_, 0:W_]
edge = np.clip((np.sqrt(((xx0-W_/2)/(W_/2))**2 + ((yy0-H_/2)/(H_/2))**2) - 0.45)/0.55, 0, 1)
rs = np.roll(a[...,0], 3, axis=1); bs = np.roll(a[...,2], -3, axis=1)
a[...,0] = a[...,0]*(1-edge) + rs*edge; a[...,2] = a[...,2]*(1-edge) + bs*edge
# clumpy coloured grain, stronger in shadows/mids
rng = np.random.default_rng(1988)
def grain(scale, amt):
    g = rng.normal(0, 1, (H//scale, W//scale, 3)).astype(np.float32)
    g = np.asarray(Image.fromarray(((g*40)+128).clip(0,255).astype(np.uint8)).resize((W,H), Image.BILINEAR)).astype(np.float32)/255-0.5
    return g*amt
gr = grain(1, 0.07) + grain(2, 0.06) + grain(3, 0.04)
a += gr * ((1.3 - lum)*0.9)[...,None]
# uneven vignette
yy, xx = np.mgrid[0:H, 0:W]
d = np.sqrt(((xx - W*0.52)/(W/2))**2 + ((yy - H*0.47)/(H/2))**2)
a *= (1 - 0.40*np.clip(d-0.5, 0, 1)**1.4)[...,None]
a = np.clip(a, 0, 1)
out = Image.fromarray((a*255).astype(np.uint8))
out = ImageEnhance.Contrast(out).enhance(1.0)
# date stamp (orange LED, lower right)
# seven-segment date stamp with bloom
SEG={'0':'abcdef','1':'bc','2':'abdeg','3':'abcdg','4':'bcfg','5':'acdfg','6':'acdefg','7':'abc','8':'abcdefg','9':'abcdfg',"'":'b',' ':''}
stamp = Image.new('RGB', out.size, (0,0,0)); sd = ImageDraw.Draw(stamp)
def seg(ch, x, y, w=22, h=40, t=5):
    segs=SEG.get(ch,''); m=h//2
    boxes={'a':(x,y,x+w,y+t),'b':(x+w-t,y,x+w,y+m),'c':(x+w-t,y+m,x+w,y+h),'d':(x,y+h-t,x+w,y+h),'e':(x,y+m,x+t,y+h),'f':(x,y,x+t,y+m),'g':(x,y+m-t//2,x+w,y+m+t//2)}
    for k in segs: sd.rectangle(boxes[k], fill=(255,110,30))
x0 = W-250; 
for i,ch in enumerate("'88 7 14"): seg(ch, x0+i*30, H-78)
bloom = stamp.filter(ImageFilter.GaussianBlur(4))
out = Image.fromarray(np.clip(np.asarray(out).astype(np.float32)+np.asarray(bloom).astype(np.float32)*0.9+np.asarray(stamp).astype(np.float32)*0.8,0,255).astype(np.uint8))
out = out.filter(ImageFilter.GaussianBlur(0.5))
# print: white border, rounded corners, slight paper warmth
bw = 44
paper = Image.new('RGB', (W+2*bw, H+2*bw), (246, 240, 226))
paper.paste(out, (bw, bw))
mask = Image.new('L', paper.size, 0); ImageDraw.Draw(mask).rounded_rectangle([0,0,paper.width-1,paper.height-1], radius=6, fill=255)
paper.putalpha(mask)
paper.save(dst.replace('.jpg','.png'))
print(dst.replace('.jpg','.png'), paper.size)
