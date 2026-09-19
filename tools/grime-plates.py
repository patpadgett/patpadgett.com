#!/usr/bin/env python3
"""Photoreal plates for the grime95 section (PP-006) + a 7-button remote.
Re-run any: python3 tools/grime-plates.py printer remote7
"""
import os,re,json,base64,time,sys,urllib.request
env=open('/data/pat/.hermes/.env').read()
key=re.search(r'AZURE_FOUNDRY_API_KEY=(.+)',env).group(1).strip().strip('"')
host='patm-moil89iq-eastus2.services.ai.azure.com'
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','assets','plates')+'/'
def gen(name,prompt,size,bg='transparent'):
    out=OUT+name+'.png'
    if os.path.exists(out): return name,'exists'
    body={"model":"gpt-image-2","prompt":prompt,"n":1,"size":size,"quality":"high","background":bg}
    req=urllib.request.Request(f'https://{host}/openai/v1/images/generations',data=json.dumps(body).encode(),headers={'Content-Type':'application/json','api-key':key,'Authorization':'Bearer '+key})
    err=''
    for attempt in range(3):
        try:
            t=time.time(); r=json.load(urllib.request.urlopen(req,timeout=600))
            open(out,'wb').write(base64.b64decode(r['data'][0]['b64_json'])); return name,round(time.time()-t)
        except Exception as e:
            err=str(e); time.sleep(10)
    return name,'FAIL '+err
STYLE=" Photorealistic studio product photograph, medium-format camera, soft top-left key light, subtle realistic reflections, fine surface detail, real materials, slight wear and dust. Isolated object on a fully transparent background, no shadow on the ground, no text, no logos, no people."
P={
 'printer': ("A 1995 beige 9-pin dot-matrix computer printer, straight-on front view, filling the frame, sitting level. Yellowed putty-beige ABS plastic case, a wide horizontal paper exit slot running along the top with a clear smoked-plastic hinged lid tilted open, a black rubber platen knob on the right side, tractor-feed sprockets visible inside the slot, a small front control panel with three square membrane buttons and two tiny LEDs (one green lit), ventilation slots. NO paper in the printer at all, the slot is empty and dark.",'1536x1024'),
 'remote7': ("A 1979 wood-grain television remote control standing upright, straight-on front view, filling the frame vertically. Tall narrow slab, dark chocolate-brown plastic frame with slightly worn edges, a faux walnut wood-grain laminate face panel, a small raised rectangular emitter tab centred on the top edge. Inset in the centre a tall rounded-rectangle brushed-aluminium plate running from near the top to near the bottom. On the plate, ONE single vertical column of exactly SEVEN identical round domed push-buttons with thin dark bezel rings, evenly spaced, horizontally centred: the TOP button is glossy red, the other six are medium grey. No labels, no printing anywhere.",'1024x1536'),
}
names=sys.argv[1:] or list(P)
for n in names:
    print(gen(n,*P[n]),flush=True)
