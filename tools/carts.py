#!/usr/bin/env python3
import os,re,json,base64,time,sys,urllib.request,concurrent.futures as cf
env=open('/data/pat/.hermes/.env').read()
m=re.search(r'AZURE_FOUNDRY_API_KEY=(.+)',env); key=m.group(1).strip().strip('"') if m else ''
host='patm-moil89iq-eastus2.services.ai.azure.com'
OUT='/data/pat/2_PUBLISHED/patpadgett.com/assets/carts/'
os.makedirs(OUT,exist_ok=True)
def gen(name,prompt,size='1024x1536'):
    out=OUT+name+'.png'
    if os.path.exists(out): return name,'exists'
    body={"model":"gpt-image-2","prompt":prompt,"n":1,"size":size,"quality":"high","background":"opaque"}
    req=urllib.request.Request(f'https://{host}/openai/v1/images/generations',data=json.dumps(body).encode(),headers={'Content-Type':'application/json','api-key':key,'Authorization':'Bearer '+key})
    err=''
    for a in range(3):
        try:
            t=time.time(); r=json.load(urllib.request.urlopen(req,timeout=600))
            open(out,'wb').write(base64.b64decode(r['data'][0]['b64_json'])); return name,round(time.time()-t)
        except Exception as e: err=str(e); time.sleep(10)
    return name,'FAIL '+err
STYLE=("Original 1986 8-bit video game box-art illustration in the style of early Nintendo Entertainment System launch titles: chunky pixel-art sprites drawn LARGE with thick black outlines on a flat solid-colour background, simple ground line, a few pixel clouds or stars, strong primary colours, slightly faded printed-label look. Fill the whole frame edge to edge. Absolutely NO text, NO letters, NO logos, NO borders, NO real trademarked characters. Scene: {scene}")
P={
 'label-music':STYLE.format(scene="a short stocky pixel-art rocker in a red knit cap and denim overalls with a bushy brown beard, mid-jump, playing an oversized electric bass guitar; above him a floating brick block emits gold coins and pixel musical notes; a green warp pipe on the right; brick ground; sky-blue background with pixel clouds."),
 'label-table':STYLE.format(scene="a pixel-art hunting dog standing on hind legs in tall grass, laughing with its eyes squeezed shut, holding up a rolled MAGAZINE in its paws instead of a duck, while a lit pixel cigarette smoulders in an ashtray on a small brown coffee table beside it; a pixel duck flying away in the distance; light-blue sky, dark green grass strip."),
 'label-balls':STYLE.format(scene="a boxing ring seen from behind a small green-haired pixel boxer in green shorts and red gloves who is squaring up against a HUGE grotesque rubber ball with bulging eyes and a toothy grin that stands where the champion would be; a pixel referee; dark blue background, ring ropes."),
 'label-octavitin':STYLE.format(scene="seen from under a bed in a dark bedroom: a friendly round pixel-art monster with eight short tentacle arms, big eyes and a little orange flame tuft on its head, peeking out from under the bed slats holding a striped sock; a small pixel girl in striped pajamas kneels on the floor shining a flashlight whose yellow cone of light lands on the monster; midnight-blue background, a few pixel stars in a window."),
 'label-work':STYLE.format(scene="a pixel-art kid in a T-shirt sitting at a tiny beige desktop computer with a black screen, a telephone handset cradled in a modem beside it, stacks of floppy disks, a bedroom window showing night; the kid is flexing one arm; purple-black background with pixel stars."),
}
jobs=sys.argv[1:] or list(P)
with cf.ThreadPoolExecutor(4) as ex:
    for name,res in ex.map(lambda k: gen(k,P[k]),jobs): print(name,res,flush=True)
