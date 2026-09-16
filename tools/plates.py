#!/usr/bin/env python3
import os,re,json,base64,time,sys,urllib.request,concurrent.futures as cf
env=open('/data/pat/.hermes/.env').read()
key=re.search(r'AZURE_FOUNDRY_API_KEY=(.+)',env).group(1).strip().strip('"')
host='patm-moil89iq-eastus2.services.ai.azure.com'
OUT='/data/pat/2_PUBLISHED/genx.patpadgett.com/assets/plates/'
os.makedirs(OUT,exist_ok=True)
def gen(name,prompt,size='1536x1024',quality='high',bg='transparent'):
    out=OUT+name+'.png'
    if os.path.exists(out): return name,'exists'
    body={"model":"gpt-image-2","prompt":prompt,"n":1,"size":size,"quality":quality,"background":bg}
    req=urllib.request.Request(f'https://{host}/openai/v1/images/generations',data=json.dumps(body).encode(),headers={'Content-Type':'application/json','api-key':key,'Authorization':'Bearer '+key})
    for attempt in range(3):
        try:
            t=time.time(); r=json.load(urllib.request.urlopen(req,timeout=600))
            open(out,'wb').write(base64.b64decode(r['data'][0]['b64_json'])); return name,round(time.time()-t)
        except Exception as e:
            err=str(e); time.sleep(10)
    return name,'FAIL '+err
STYLE=" Photorealistic studio product photograph, medium-format camera, soft top-left key light, subtle realistic reflections, fine surface detail, real materials, slight wear. Isolated object on a fully transparent background, no shadow on the ground, no text, no logos, no people."
P={
 'tv': ("A 1985 wood-grain console television, straight-on front view filling the frame. Real walnut veneer cabinet with visible grain and slightly worn edges, a large 4:3 CRT with dark curved glass that is switched off (very dark greenish-black glass, faint soft reflection), thick black plastic bezel around the tube. On the right, a vertical black control panel with a large brushed-chrome channel knob with a raised pointer, a smaller chrome volume knob below it, a tiny red LED, and a woven fabric speaker grille at the bottom."+STYLE,'1536x1024'),
 'cassette': ("A 1980s audio cassette tape lying flat, straight-on top view, filling the frame. Smoked clear polycarbonate shell showing brown magnetic tape wound on two white hub reels, five screws, a blank matte pale-yellow paper label area on the upper half, chrome-position notch, tiny scuffs on the plastic."+STYLE,'1536x1024'),
 'vhs': ("A 1980s VHS clamshell rental case standing upright, front view, slightly angled 8 degrees to show the spine. Black textured plastic case with a glossy blank white paper sleeve insert on the front and spine (completely blank, no printing), light scuffs and a faint rental-store residue on the plastic."+STYLE,'1024x1536'),
 'cart': ("A grey 1986 NES-style video game cartridge standing upright, straight-on front view, filling the frame. Dull grey injection-moulded plastic with the classic vertical grip ridges at the top, a completely blank matte black label recess on the front (no printing), a small circular gold foil seal area bottom right, fine mould lines and a little dust."+STYLE,'1024x1536'),
 'mac': ("A 1993 Macintosh Color Classic all-in-one computer, straight-on front view, filling the frame. Warm platinum beige plastic with slight yellowing, the 10-inch colour CRT screen switched off (dark glass), floppy drive slot on the right side under the screen, small speaker grille, brightness/contrast controls, the hint of an ADB keyboard cable. No Apple logo."+STYLE,'1024x1536'),
 'waxpack': ("A 1987 unopened wax paper trading card pack lying at a slight angle, front view. Glossy waxy paper wrapper with a completely blank turquoise, hot pink and yellow diagonal colour-block design (no text or characters), the crinkled wax fold visible, a slight bulge from the gum stick inside."+STYLE,'1536x1024'),
 'sticker': ("A sheet of blank die-cut vinyl stickers on a white waxy backing paper, straight-on top view, filling the frame. Nine glossy rounded-rectangle blank stickers in different flat 1980s colours (red, yellow, grey, black, pink, lime green, orange, lavender, peach), slightly lifted corners, realistic gloss highlights, one sticker half peeled."+STYLE,'1536x1024'),
 'grain': ("Photorealistic close-up of a walnut wood-panel wall from a 1980s living room, straight on, even lighting, seamless texture, dark walnut with visible grain and slight sheen.","1536x1024"),
}
jobs=sys.argv[1:] or list(P)
with cf.ThreadPoolExecutor(4) as ex:
    for name,res in ex.map(lambda k: gen(k,P[k][0],P[k][1],bg=('opaque' if k=='grain' else 'transparent')),jobs):
        print(name,res,flush=True)
