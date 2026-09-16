#!/usr/bin/env python3
import os,re,json,base64,time,sys,urllib.request,concurrent.futures as cf
env=open('/data/pat/.hermes/.env').read()
key=re.search(r'AZURE_FOUNDRY_API_KEY=(.+)',env).group(1).strip().strip('"')
host='patm-moil89iq-eastus2.services.ai.azure.com'
OUT='/data/pat/2_PUBLISHED/genx.patpadgett.com/assets/toys/'
os.makedirs(OUT,exist_ok=True)
def gen(name,prompt,size,bg):
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
BALL=("A 1986 gross-out rubber toy ball character in the style of hand-painted 1980s toy packaging art, a round foam ball about the size of a softball with a grotesque, gleeful monster face sculpted into it: bulging bloodshot eyes, huge toothy grin, slimy textures, exaggerated painted airbrush highlights. Photorealistic toy product photograph of the actual rubber ball, studio lit, straight on, isolated on a fully transparent background, no text, no logos, no hands. Theme: {theme}")
CARD=("An original 1985-style painted gross-out trading card illustration, in the manner of 1980s satirical kids sticker cards: a chubby round-faced cartoon kid with big eyes, painted in gouache with airbrushed highlights, over-the-top disgusting gag, saturated colours, thick black outline around the character, plain flat bright background colour behind the character. Character: {who}. Portrait composition, the character fills the frame, NO text, NO letters, NO logos, NO borders. Isolated on a fully transparent background.")
P={
 'ball-nintendo':(BALL.format(theme="grey plastic console texture, a red controller-button eye, a cartridge jammed in its mouth, blowing dust"),'1024x1024','transparent'),
 'ball-thrasher':(BALL.format(theme="a skateboard-deck scab across its head, road rash, checkerboard high-top-sneaker tongue, screaming"),'1024x1024','transparent'),
 'ball-fnm':(BALL.format(theme="a fish-lipped screaming face wearing a backwards baseball cap, purple and lime, mid-scream with a microphone-shaped tongue"),'1024x1024','transparent'),
 'ball-gnr':(BALL.format(theme="a rock-and-roll ball with a bandana, snakes and thorny roses tangled in stringy hair, gold-tooth sneer"),'1024x1024','transparent'),
 'ball-synth':(BALL.format(theme="chrome and neon: a magenta-and-cyan gridded ball with a sunset visor and a tiny sports car exhaust pipe for a nose"),'1024x1024','transparent'),
 'ball-gpk':(BALL.format(theme="a bubblegum-pink ball blowing a giant sticky bubble with wax-paper wrappers stuck to it"),'1024x1024','transparent'),
 'ball-nick':(BALL.format(theme="completely drenched in dripping bright green slime, orange rubber underneath, tongue out, hands raised in a shrug, NO sign, NO text anywhere"),'1024x1024','transparent'),
 'ball-nes':(BALL.format(theme="a scruffy white luckdragon-dog face with a long muzzle and pearly pink scales, bloodshot googly eyes, slobbery tongue, a crumbling old leather book jammed in its teeth, dark storm clouds painted on its back"),'1024x1024','transparent'),
 'ball-bride':(BALL.format(theme="a swashbuckler ball with a black mask over its eyes, a thin moustache, a tiny rapier stuck through it, smug smile"),'1024x1024','transparent'),
 'card-emil':(CARD.format(who="E-Mail Emil: a kid stuffed head-first into an overflowing mailbox, letters and envelopes erupting everywhere, one hand waving a stamped letter"),'1024x1536','transparent'),
 'card-herb':(CARD.format(who="Git Hub Herb: a kid hunched over a beige 1980s computer, solid glowing green screen light on his face (NO characters or letters on the screen, just glow), keyboard keys flying, a cat sitting on the monitor"),'1024x1536','transparent'),
 'card-lenny':(CARD.format(who="Linked Lenny: a kid in an oversized suit and clip-on tie tangled in a long chain of BLANK white business cards with no writing on them, giant grin, thumbs up"),'1024x1536','transparent'),
 'card-cal':(CARD.format(who="Classic Cal: a kid dressed like a 1970s TV repairman with a wood-grain television for a head, rabbit-ear antennae, test pattern on the screen face"),'1024x1536','transparent'),
 'card-gum':(CARD.format(who="Gum: a kid whose whole face is stretched into a giant pink bubblegum bubble, gum stuck in hair, a palm tree and Florida sun behind"),'1024x1536','transparent'),
}
jobs=sys.argv[1:] or list(P)
with cf.ThreadPoolExecutor(5) as ex:
    for name,res in ex.map(lambda k: gen(k,*P[k]),jobs):
        print(name,res,flush=True)
