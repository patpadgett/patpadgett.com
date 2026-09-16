#!/usr/bin/env python3
"""Hermes II ACiD-style intro scroller → assets/ansi/hermes-intro.svg
Grid: 80 text cols x 2 half-blocks per row. Every element uses shaded fills (░▒▓ as ordered dither),
bevelled letterforms (light top/left, dark bottom/right), and sits on a fixed layout grid (no collisions)."""
import os, random
OUT='/data/pat/2_PUBLISHED/genx.patpadgett.com/assets/ansi/'
os.makedirs(OUT,exist_ok=True)
random.seed(1992)
W=80
COL={'W':'#ffffff','w':'#c0c0c0','g':'#808080','d':'#404040','M':'#ff55ff','m':'#aa00aa','C':'#55ffff','c':'#00aaaa',
     'Y':'#ffff55','o':'#aa5500','B':'#5555ff','b':'#0000aa','G':'#55ff55','n':'#00aa00','R':'#ff5555','r':'#aa0000','K':'#000000'}
F={
'A':[".###.","#...#","#...#","#####","#...#","#...#","#...#"],'B':["####.","#...#","#...#","####.","#...#","#...#","####."],
'C':[".####","#....","#....","#....","#....","#....",".####"],'D':["####.","#...#","#...#","#...#","#...#","#...#","####."],
'E':["#####","#....","#....","####.","#....","#....","#####"],'F':["#####","#....","#....","####.","#....","#....","#...."],'Z':["#####","....#","...#.","..#..",".#...","#....","#####"],'G':[".####","#....","#....","#..##","#...#","#...#",".####"],
'H':["#...#","#...#","#...#","#####","#...#","#...#","#...#"],'I':["#####","..#..","..#..","..#..","..#..","..#..","#####"],
'K':["#...#","#..#.","#.#..","##...","#.#..","#..#.","#...#"],'L':["#....","#....","#....","#....","#....","#....","#####"],
'M':["#...#","##.##","#.#.#","#.#.#","#...#","#...#","#...#"],'N':["#...#","##..#","#.#.#","#..##","#...#","#...#","#...#"],
'O':[".###.","#...#","#...#","#...#","#...#","#...#",".###."],'P':["####.","#...#","#...#","####.","#....","#....","#...."],
'R':["####.","#...#","#...#","####.","#.#..","#..#.","#...#"],'S':[".####","#....","#....",".###.","....#","....#","####."],
'T':["#####","..#..","..#..","..#..","..#..","..#..","..#.."],'U':["#...#","#...#","#...#","#...#","#...#","#...#",".###."],
'W':["#...#","#...#","#...#","#.#.#","#.#.#","##.##","#...#"],'Y':["#...#","#...#",".#.#.","..#..","..#..","..#..","..#.."],
'0':[".###.","#..##","#.#.#","##..#","#...#","#...#",".###."],'1':["..#..",".##..","..#..","..#..","..#..","..#..","#####"],
'2':[".###.","#...#","....#","...#.","..#..",".#...","#####"],'3':["####.","....#","....#",".###.","....#","....#","####."],
'4':["#..#.","#..#.","#..#.","#####","...#.","...#.","...#."],'6':[".###.","#....","#....","####.","#...#","#...#",".###."],
'9':[".###.","#...#","#...#",".####","....#","....#",".###."],' ':[".....",".....",".....",".....",".....",".....","....."],
'.':[".....",".....",".....",".....",".....","..#..","....."],'-':[".....",".....",".....","#####",".....",".....","....."],
}
def big(word, scale=1, gap=1):
    rows=['']*7
    for ch in word:
        for i in range(7): rows[i]+=F[ch][i]+'.'*gap
    rows=[r[:-gap] for r in rows]
    out=[]
    for r in rows:
        line=''.join(ch*scale for ch in r); out+=[line]*scale
    return out
def width(m): return len(m[0])

H=168
c=[['.']*W for _ in range(H)]
def put(x,y,col):
    if 0<=y<H and 0<=x<W: c[y][x]=col
def get(x,y): return c[y][x] if 0<=y<H and 0<=x<W else '.'
def shade(x0,y0,x1,y1,levels):
    """levels: list of colour keys from dense->sparse; ordered 4x4 Bayer dither across the vertical span"""
    bayer=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]]
    for y in range(y0,y1):
        t=(y-y0)/max(1,(y1-y0-1))
        for x in range(x0,x1):
            thr=bayer[y%4][x%4]/16
            # pick level by t with dither
            idx=min(len(levels)-1, int(t*len(levels) + (0.5 if thr<0.5 else -0.5) + 0.5))
            idx=max(0,idx); put(x,y,levels[idx])
def bevel_text(mat,x0,y0,face,light,dark,shadow_col,sh=2):
    # drop shadow
    for y,row in enumerate(mat):
        for x,ch in enumerate(row):
            if ch=='#' and get(x0+x+sh,y0+y+sh)=='.': put(x0+x+sh,y0+y+sh,shadow_col)
    # face with vertical gradient
    h=len(mat)
    for y,row in enumerate(mat):
        for x,ch in enumerate(row):
            if ch!='#': continue
            t=y/(h-1)
            col=face[min(len(face)-1,int(t*len(face)))]
            # bevel: light if top/left neighbour empty, dark if bottom/right empty
            up=y==0 or mat[y-1][x]!='#'; left=x==0 or row[x-1]!='#'
            down=y==h-1 or mat[y+1][x]!='#'; right=x==len(row)-1 or row[x+1]!='#'
            if up or left: col=light
            elif down or right: col=dark
            put(x0+x,y0+y,col)
def hline(y,x0,x1,col):
    for x in range(x0,x1): put(x,y,col)
def vbar(x,y0,y1,pattern):
    for y in range(y0,y1): put(x,y,pattern[y%len(pattern)])

# ---------- frame: layered shaded side pillars (ACiD style) ----------
for y in range(0,H):
    vbar(0,0,H,['m','m','M','m']); vbar(1,0,H,['M','m','m','m']); vbar(2,0,H,['d','m','.','m'])
    vbar(W-1,0,H,['m','m','M','m']); vbar(W-2,0,H,['m','m','m','M']); vbar(W-3,0,H,['m','.','m','d'])

# top cap: shaded gradient band magenta→dark
shade(3,0,W-3,5,['M','m','d'])
hline(5,3,W-3,'w'); hline(6,3,W-3,'d')

# ---------- HERMES (scale 2, 6 glyphs*6*2 - gap = 70 wide) ----------
herm=big('HERMES',2,1)
x=(W-width(herm))//2
bevel_text(herm,x,10,['W','w','C','c'],'W','c','b',2)
# underline shaded
shade(x,26,x+width(herm),28,['c','b'])

# ---------- II with wings ----------
two=big('II',2,2)
xi=(W-width(two))//2
bevel_text(two,xi,31,['Y','Y','R','r'],'W','r','d',2)
# wings: shaded horizontal bars either side
shade(6,36,xi-3,40,['M','m','d'])
shade(xi+width(two)+3,36,W-6,40,['M','m','d'])

# ---------- PADGETT (left) / BBS (right), same baseline ----------
pad=big('PADGETT',1,1); bbs=big('BBS',1,1)
bevel_text(pad,6,49,['M','M','m'],'W','m','d',1)
bevel_text(bbs,W-6-width(bbs),49,['W','w','g'],'W','g','d',1)
hline(58,6,W-6,'g'); hline(59,6,W-6,'d')

# ---------- info row: NODE 1 · 2400-9600 · EST 1992 ----------
i1=big('NODE 1',1); i2=big('2400',1); i3=big('1992',1)
bevel_text(i1,6,63,['G','n'],'W','n','d',1)                       # cols 6..40
bevel_text(i2,W-6-width(i2),63,['Y','o'],'W','o','d',1)           # right aligned baud
bevel_text(i3,W-6-width(i3),72,['C','c'],'W','c','d',1)           # year on next row, right aligned

# ---------- skyline with horizon glow ----------
sky0,ground=82,108
shade(3,sky0,W-3,ground,['.','b','b','m','M'])  # night sky darkening toward a magenta horizon glow
# buildings: shaded fronts (B) with dark sides (b), lit windows
xx=4
while xx<W-6:
    bw=random.randint(3,8); bh=random.randint(6,20); top=ground-bh
    for y in range(top,ground):
        for x in range(xx,min(xx+bw,W-4)):
            side = x>=xx+bw-1
            put(x,y,'d' if side else ('b' if (y-top)>1 else 'B'))
            if not side and (y-top)>1 and (y%3==0) and (x-xx)%2==1 and random.random()<.55: put(x,y,'Y')
    # antenna
    if random.random()<.35: put(xx+1,top-1,'g'); put(xx+1,top-2,'R')
    xx+=bw+random.randint(1,2)
# ground / street
hline(ground,3,W-3,'w'); hline(ground+1,3,W-3,'g'); shade(3,ground+2,W-3,ground+5,['d','.'])

# ---------- menu bar ----------
mb0=116
shade(4,mb0,W-4,mb0+21,['b','b','d','d'])
# three menu items, each: coloured number box + word; total widths 5+2+ (5 letters*6-1=29) ≈ 36 → two rows would be safer; use scale 1 with tight gap 1 and abbreviations MUSIC / WORK / BLOG spaced evenly
items=[('1','MUSIC','R'),('2','WORK','G'),('3','BLOG','C')]
# row layout: MUSIC (29 wide) at 5..34; WORK (23) at 38..61; BLOG (23) needs 24 → overflow. So two rows: MUSIC+WORK on row 1, BLOG centred row 2.
def item(num,word,col,x,y):
    n=big(num,1); w=big(word,1)
    shade(x-1,y-1,x+width(n)+1,y+8,[col,col])           # number plate
    bevel_text(n,x,y,['K','K'],'K','K','.',0)
    bevel_text(w,x+width(n)+3,y,['W','w'],'W','g','K',1)
item('1','MUSIC','R',6,mb0+2); item('2','WORK','G',44,mb0+2)
item('3','BLOG','C',6,mb0+12)
tag=big('TUNE',1); bevel_text(tag,W-6-width(tag),mb0+12,['M','m'],'W','m','K',1)
hline(mb0+21,4,W-4,'w')

# ---------- credits block ----------
cr0=140
sy=big('SYSOP PAT',1); ac=big('OZARKS MO',1)
bevel_text(sy,(W-width(sy))//2,cr0,['G','n'],'W','n','K',1)
bevel_text(ac,(W-width(ac))//2,cr0+9,['C','c'],'W','c','K',1)
# bottom cap
shade(3,H-6,W-3,H,['d','m','M'])
hline(H-7,3,W-3,'w')

# ---------- emit ----------
rects=[]
for y,row in enumerate(c):
    x=0
    while x<W:
        col=row[x]
        if col!='.':
            x0=x
            while x<W and row[x]==col: x+=1
            rects.append(f'<rect x="{x0*8}" y="{y*8}" width="{(x-x0)*8}" height="8" fill="{COL[col]}"/>')
        else: x+=1
svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W*8} {H*8}" width="{W*8}" height="{H*8}" shape-rendering="crispEdges">\n<rect width="100%" height="100%" fill="#000"/>\n'+'\n'.join(rects)+'\n</svg>\n'
open(OUT+'hermes-intro.svg','w').write(svg)
print(OUT+'hermes-intro.svg',len(rects),'rects',W*8,'x',H*8, round(os.path.getsize(OUT+'hermes-intro.svg')/1024),'KB')
