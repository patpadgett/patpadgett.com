#!/usr/bin/env python3
"""Octavitin plate: a blank 1980s hardcover picture book, straight on, transparent background.
The real cover art + live title are positioned onto the measured cover region in octavitin.css."""
import os,re,json,base64,time,sys,urllib.request
env=open('/data/pat/.hermes/.env').read()
key=re.search(r'AZURE_FOUNDRY_API_KEY=(.+)',env).group(1).strip().strip('"')
host='patm-moil89iq-eastus2.services.ai.azure.com'
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','assets',sys.argv[2] if len(sys.argv)>2 else 'octavitin')
os.makedirs(OUT,exist_ok=True)
STYLE=" Photorealistic studio product photograph, medium-format camera, soft top-left key light, subtle realistic reflections, fine surface detail, real materials, slight wear. Isolated object on a fully transparent background, no shadow on the ground, no text, no logos, no people."
P={
 'remote':("A 1978 wood-grain television remote control, standing upright, perfectly straight-on orthographic front view, on a fully transparent background, with clear empty margin above and below the remote. Slim dark-brown plastic body with a walnut wood-grain front panel and a long brushed-aluminum faceplate. On the faceplate there are SIX blank round buttons, all the same size, arranged in ONE vertical column with equal spacing: the topmost button is glossy RED, the other five are matte dark grey. Six buttons total: one red, five grey. Absolutely no printed labels, numbers, icons or text anywhere. Slight edge wear."+STYLE,'1024x1536'),
 'flashlight':("A 1980s household flashlight lying on its side, straight-on side view, filling the frame horizontally, switched ON: chrome and red-painted steel barrel with a ribbed grip, a black rubber slide switch, a wide chrome bezel head on the RIGHT with a warm-yellow lit bulb behind the glass lens glowing softly. Slight paint chips and fingerprints. No visible light beam on the background."+STYLE,'1536x1024'),
 'book':("A 1988 hardcover children's picture book standing upright, perfectly straight-on orthographic front view with the front cover exactly parallel to the camera (no perspective, no rotation, no visible spine face), the closed book filling the frame edge to edge. Library binding with a completely blank matte deep-navy cloth cover (no printing, no picture), slightly bumped and whitened corners, a faint rectangular scuff where a library sticker was peeled off the bottom-left of the cover, the cream page block visible along the right edge, the cream page block visible as a thin strip along the right edge only. The background must be fully transparent alpha (PNG), nothing behind the book."+STYLE,'1024x1536'),
}
def gen(name,prompt,size):
    out=os.path.join(OUT,name+'.png')
    if os.path.exists(out): return name,'exists'
    body={"model":"gpt-image-2","prompt":prompt,"n":1,"size":size,"quality":"high","background":"transparent"}
    req=urllib.request.Request(f'https://{host}/openai/v1/images/generations',data=json.dumps(body).encode(),headers={'Content-Type':'application/json','api-key':key,'Authorization':'Bearer '+key})
    err=''
    for attempt in range(3):
        try:
            t=time.time(); r=json.load(urllib.request.urlopen(req,timeout=600))
            open(out,'wb').write(base64.b64decode(r['data'][0]['b64_json'])); return name,round(time.time()-t)
        except Exception as e:
            err=str(e); time.sleep(10)
    return name,'FAIL '+err
for k in ([sys.argv[1]] if len(sys.argv)>1 else list(P)):
    print(*gen(k,*P[k]),flush=True)
