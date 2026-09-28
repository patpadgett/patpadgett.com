"""Minimal-footprint repaint of gibberish cover lines (patpadgett.com mag wall).
SPIN: the three pink lines are re-set with width-matched copy (each new line stretched to the old line's exact
width and cap height, so the new letters cover the old footprint); the yellow line and everything else stay original.
Hit Parader: only the duplicated 'IS' on line 2 is masked out; the original type is untouched otherwise."""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np
from scipy import ndimage
from skimage.restoration import inpaint_biharmonic
FONT='barlow-condensed-normal-800.ttf'; rng=np.random.default_rng(3)
def near(a,c,t): return np.sqrt(((a-np.array(c,float))**2).sum(2))<t
def inpaint(a, mask, pad=10):
    ys,xs=np.where(mask); y0,y1=max(0,ys.min()-pad),min(a.shape[0],ys.max()+pad+1); x0,x1=max(0,xs.min()-pad),min(a.shape[1],xs.max()+pad+1)
    out=inpaint_biharmonic(a[y0:y1,x0:x1]/255.,mask[y0:y1,x0:x1],channel_axis=-1); b=a.copy(); b[y0:y1,x0:x1]=out*255; return b
def regrain(a, mask, ref_box):
    y0,y1,x0,x1=ref_box; reg=a[y0:y1,x0:x1]; sd=(reg-ndimage.gaussian_filter(reg,(1.0,1.0,0))).std(axis=(0,1))
    noise=rng.normal(0,1,a.shape)*sd*0.85; noise=ndimage.gaussian_filter(noise,(0.6,0.6,0))*1.6
    return np.where(mask[:,:,None],a+noise,a)
def capfont(cap):
    f=ImageFont.truetype(FONT,10); hb=f.getbbox('H'); return ImageFont.truetype(FONT,max(6,round(10*cap/(hb[3]-hb[1]))))
def typeset(base, lines, S=4, blur=0.5, desat=0.08):
    """lines: (text, cap, baseline, x_left, target_w, fill, outline[, font, stroke]). Each line is stretched to target_w."""
    W,H=base.size; layer=Image.new('RGBA',(W*S,H*S),(0,0,0,0))
    for text,cap,base_y,x,tw,fill,ol,*opt in lines:
        font=opt[0] if opt else FONT; stroke=opt[1] if len(opt)>1 else 0.9
        f=ImageFont.truetype(font,10); hb=f.getbbox('H'); f=ImageFont.truetype(font,max(6,round(10*cap*S/(hb[3]-hb[1])))); sw=max(1,round(stroke*S))
        l,t,r,b=f.getbbox(text,anchor='ls',stroke_width=sw); tmp=Image.new('RGBA',(r-l+2,b-t+2),(0,0,0,0))
        ImageDraw.Draw(tmp).text((-l+1,-t+1),text,font=f,fill=fill+(255,),anchor='ls',stroke_width=sw,stroke_fill=ol+(255,))
        nat=f.getlength(text); sc=tw*S/nat; tmp=tmp.resize((max(1,round(tmp.width*sc)),tmp.height),Image.LANCZOS)
        layer.alpha_composite(tmp,(round(x*S+(l-1)*sc),base_y*S+t-1)); print(f'  {text[:24]:24s} stretch {sc:.2f}')
    layer=layer.resize((W,H),Image.LANCZOS).filter(ImageFilter.GaussianBlur(blur)); lay=np.array(layer).astype(float)
    al=lay[:,:,3:4]/255.; rgb=lay[:,:,:3]; rgb=rgb*(1-desat)+rgb.mean(2,keepdims=True)*desat
    return np.array(base).astype(float)*(1-al)+rgb*al
def out(arr, stem, zoom_box, zoom_name):
    img=Image.fromarray(np.clip(arr,0,255).round().astype('uint8'))
    img.save(stem+'.jpg',quality=86,subsampling=0,optimize=True); Image.open(stem+'.jpg').save(stem+'.webp',quality=82,method=6)
    x0,y0,x1,y1=zoom_box; Image.open(stem+'.jpg').crop(zoom_box).resize(((x1-x0)*3,(y1-y0)*3),Image.LANCZOS).save(zoom_name); return img

# ---------- SPIN ----------
im=Image.open('mag1-orig.jpg').convert('RGB'); a=np.array(im).astype(float); r,g,b=a[:,:,0],a[:,:,1],a[:,:,2]
pink=(r>140)&(r-g>40)&(b-g>-5); ring=near(a,(110,45,80),42)|near(a,(150,60,110),45)
m=np.zeros(a.shape[:2],bool); m[326:410]=(pink|ring)[326:410]
m=ndimage.binary_closing(m,iterations=1); m=ndimage.binary_dilation(m,iterations=2)
print('spin mask px',m.sum())
bg=regrain(inpaint(a,m),m,(200,300,20,280)); Image.fromarray(np.clip(bg,0,255).astype('uint8')).save('spin-bg2.png')
PINK=(216,105,157); PINK_O=(105,42,78)
print('SPIN lines')
spin=typeset(Image.fromarray(np.clip(bg,0,255).astype('uint8')),[
 ('COLLECT CALL FROM',                          20.5,351,14,185,PINK,PINK_O),
 ('PATRICK PADGETT:',                           20.5,379,14,195,PINK,PINK_O),
 ('Long distance, loud, and totally unlisted!', 13.5,400,14,269,PINK,PINK_O,'barlow-condensed-normal-700.ttf',0.6)])
out(spin,'mag1-fixed',(0,290,300,442),'spin-fixed-zoom.png')

print('done')
