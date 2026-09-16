#!/usr/bin/env python3
import os,re,json,base64,time,sys,urllib.request,concurrent.futures as cf
env=open('/data/pat/.hermes/.env').read()
m=re.search(r'AZURE_FOUNDRY_API_KEY=(.+)',env); key=m.group(1).strip().strip('"') if m else ''
host='patm-moil89iq-eastus2.services.ai.azure.com'
OUT='/data/pat/2_PUBLISHED/genx.patpadgett.com/assets/mags/'
os.makedirs(OUT,exist_ok=True)
def gen(name,prompt,size,bg,quality='high'):
    out=OUT+name+'.png'
    if os.path.exists(out): return name,'exists'
    body={"model":"gpt-image-2","prompt":prompt,"n":1,"size":size,"quality":quality,"background":bg}
    req=urllib.request.Request(f'https://{host}/openai/v1/images/generations',data=json.dumps(body).encode(),headers={'Content-Type':'application/json','api-key':key,'Authorization':'Bearer '+key})
    err=''
    for attempt in range(3):
        try:
            t=time.time(); r=json.load(urllib.request.urlopen(req,timeout=600))
            open(out,'wb').write(base64.b64decode(r['data'][0]['b64_json'])); return name,round(time.time()-t)
        except Exception as e:
            err=str(e); time.sleep(10)
    return name,'FAIL '+err
COVER=("A photorealistic photograph of a single vintage magazine lying flat, shot straight down, filling the frame, isolated on a fully transparent background. Glossy cover stock with a soft creased spine, a curled corner, a small coffee ring stain and price-sticker residue. The cover design is an ORIGINAL period-accurate pastiche with NO real magazine names, NO real logos and NO readable words — all text areas are rendered as blurred or abstract glyph shapes only. {look}")
P={
 'mag-skate':(COVER.format(look="Look: a 1988 skateboarding magazine. Bold black masthead shape across the top, a high-contrast photo of a skater mid-air over a backyard pool in Vision Street Wear high-tops, hard flash, saturated neon graffiti in the background, punk-zine layout."),'1024x1536','transparent'),
 'mag-metal':(COVER.format(look="Look: a 1989 hard-rock/metal magazine. Red-and-yellow masthead shape, a long-haired rock singer in a bandana screaming into a mic under red stage lights, leather and bandanas, small inset thumbnails down the left edge, chaotic layout."),'1024x1536','transparent'),
 'mag-hacker':(COVER.format(look="Look: a 2002 quarterly hacker magazine, digest size, matte paper. A single moody, grainy photograph of a payphone on a rainy city street at night fills the whole cover, with a slim masthead shape in the top corner and a tiny volume/issue box. Understated, no other elements."),'1024x1536','transparent'),
 'mag-linux':(COVER.format(look="Look: a 2001 European Linux magazine. Clean tech layout, deep blue masthead band, a big penguin-shaped mascot rendered in chrome, screenshots of terminal windows, bright cyan and orange callout shapes, a cover-mounted CD-ROM in a paper sleeve stuck to the front."),'1024x1536','transparent'),
 'mag-games':(COVER.format(look="Look: a 1989 video-game tips magazine for kids. Bright red masthead shape, a painted claymation-style scene of a plumber hero jumping over lava, exploding starburst callout shapes, primary colours, cheap glossy newsprint."),'1024x1536','transparent'),
 'beercan':("Photorealistic photograph shot straight down from directly above of a single opened 1980s 12-oz steel beer can standing upright. Because of the top-down angle we mostly see the silver lid with a bent pull-tab and a small pool of beer, and around it the cylindrical shoulder of the can showing a sliver of its label: a warm brown and cream colour scheme with a gold band and a small red-and-white shield shape, slightly dented, beads of condensation, a few drips. NO readable text or letters anywhere. Isolated on a fully transparent background, no table, no shadow.",'1024x1024','transparent'),
 'table':("Photorealistic top-down photograph of a cheap 1980s wood-grain laminate coffee table surface, filling the entire frame edge to edge with no background visible. Dark walnut-print laminate peeling at one corner showing particleboard, dozens of pale water rings and coffee-cup stains, cigarette burn marks, scratches, dust in the grain, sticky residue, a faint rectangle where something sat for years. Harsh warm lamp light from the upper left with a soft falloff. No objects on it, no text.",'1536x1024','opaque'),
 'ashtray':("Photorealistic photograph shot straight down of a heavy amber glass ashtray from the 1970s, filled with grey ash and several crushed cigarette butts, one lit cigarette resting in a notch with a long glowing orange ember and a short curl of ash at the tip. NO smoke. Isolated on a fully transparent background, no table, no text.",'1024x1024','transparent'),
}
jobs=sys.argv[1:] or list(P)
with cf.ThreadPoolExecutor(4) as ex:
    for name,res in ex.map(lambda k: gen(k,*P[k]),jobs):
        print(name,res,flush=True)
