from PIL import Image,ImageDraw,ImageFilter
import numpy as np, math, random
random.seed(114)
W,H=3072,1800
rng=np.random.default_rng(114)
def noise(w,h):
 a=rng.integers(0,256,(h,w),dtype=np.uint8)
 return np.asarray(Image.fromarray(a).resize((W,H),Image.Resampling.BICUBIC),dtype=np.float32)/255
n1=noise(12,8);n2=noise(50,32);n3=noise(190,110)
y,x=np.mgrid[0:H,0:W]
light=np.clip(1-.28*((x/W-.38)**2+(y/H-.35)**2),.6,1)
v=n1*.60+n2*.28+n3*.12
R=np.clip((47+85*v+18*(1-y/H))*light,0,255).astype('uint8')
G=np.clip((77+101*v+12*(1-y/H))*light,0,255).astype('uint8')
B=np.clip((52+65*v+7*(1-y/H))*light,0,255).astype('uint8')
img=Image.fromarray(np.dstack([R,G,B]),'RGB').convert('RGBA');d=ImageDraw.Draw(img,'RGBA')
# rock and alpine mountain ranges on edges
for side in ['left','right']:
 for i in range(18):
  cx=random.randrange(-90,520) if side=='left' else random.randrange(2530,3160)
  cy=random.randrange(-60,520) if i<12 else random.randrange(1420,1950)
  sz=random.randrange(65,220)
  d.ellipse((cx-sz,cy+sz*.2,cx+sz,cy+sz*.65),fill=(14,36,38,85))
  d.polygon([(cx-sz,cy+sz*.3),(cx-sz*.35,cy-sz*.62),(cx+sz*.13,cy-sz*1.35),(cx+sz,cy+sz*.4)],fill=(80,101,102,255))
  d.polygon([(cx+sz*.13,cy-sz*1.35),(cx+sz,cy+sz*.4),(cx+sz*.12,cy+sz*.3)],fill=(43,68,77,255))
  d.polygon([(cx-sz*.28,cy-sz*.72),(cx+sz*.13,cy-sz*1.35),(cx+sz*.48,cy-sz*.67),(cx+sz*.15,cy-sz*.84),(cx-sz*.04,cy-sz*.59)],fill=(219,226,215,230))
# river across the map; smooth ribbon polygons
pts=[]
for yy in range(-100,H+101,9):
 xx=1550+255*math.sin(yy/440)+90*math.sin(yy/160)
 pts.append((xx,yy))
def ribbon(width,color):
 left=[(xx-width/2,yy) for xx,yy in pts];right=[(xx+width/2,yy) for xx,yy in reversed(pts)]
 d.polygon(left+right,fill=color)
ribbon(226,(40,62,52,255));ribbon(207,(171,157,111,255));ribbon(177,(50,102,110,255));ribbon(145,(52,136,151,255));ribbon(112,(78,162,174,255))
for i in range(450):
 yy=random.randrange(H);xx=1550+255*math.sin(yy/440)+90*math.sin(yy/160)+random.uniform(-54,54)
 ln=random.randrange(6,36);d.line((xx,yy,xx+ln,yy-2),fill=(192,235,221,random.randrange(35,130)),width=random.choice([1,2,3]))
# curved crossing paths
roadpts=[(0,1000),(330,975),(640,1050),(940,1020),(1240,975),(1540,1030),(1850,1000),(2140,940),(2460,980),(3072,900)]
for width,col in [(78,(39,54,42,210)),(60,(154,130,92,255)),(46,(196,166,111,255)),(21,(215,192,141,180))]:d.line(roadpts,fill=col,width=width,joint='curve')
# secondary winding paths
d.line([(520,980),(630,780),(750,660),(980,620)],fill=(169,143,100,230),width=24,joint='curve')
d.line([(2180,960),(2240,1180),(2450,1300)],fill=(169,143,100,230),width=24,joint='curve')
# clusters of detailed evergreen/deciduous trees, deterministic
for i in range(1300):
 xx=random.randrange(75,W-75);yy=random.randrange(80,H-70)
 # keep center mostly open for buildings
 if 550<xx<2480 and 550<yy<1300 and random.random()<.79:continue
 if abs(xx-(1550+255*math.sin(yy/440)+90*math.sin(yy/160)))<170:continue
 s=random.randrange(16,43) if yy<950 else random.randrange(23,53)
 d.ellipse((xx-s*.7,yy+s*.3,xx+s*.8,yy+s*.65),fill=(9,39,30,85))
 d.line((xx,yy+s*.35,xx,yy-s*.52),fill=(71,61,40,255),width=max(3,s//7))
 if random.random()<.6:
  for j,(scale,dy,col) in enumerate([(1,.0,(26,72,52,255)),(.77,-.40,(35,96,65,255)),(.48,-.76,(59,121,77,255))]):
   d.polygon([(xx-s*scale,yy+s*.23+dy*s),(xx,yy-s*.9+dy*s),(xx+s*scale,yy+s*.23+dy*s)],fill=col)
 else:
  for dx,dy,ss,col in [(-.4,-.43,.58,(39,91,49,255)),(.36,-.50,.64,(46,106,57,255)),(0,-.83,.63,(75,133,72,255))]:
   d.ellipse((xx+(dx-ss)*s,yy+(dy-ss)*s,xx+(dx+ss)*s,yy+(dy+ss)*s),fill=col)
# meadow flowers, pebbles
for i in range(2600):
 xx=random.randrange(W);yy=random.randrange(H)
 if abs(xx-(1550+255*math.sin(yy/440)+90*math.sin(yy/160)))<140:continue
 r=random.choice([1,1,2,3]);color=random.choice([(228,213,142,195),(239,230,194,190),(180,197,112,170),(104,151,89,150)])
 d.ellipse((xx-r,yy-r,xx+r,yy+r),fill=color)
# landmark stone circle
cx,cy=1020,1390
d.ellipse((cx-130,cy-50,cx+130,cy+58),fill=(21,43,36,115));d.ellipse((cx-120,cy-62,cx+120,cy+39),fill=(141,146,130,255));d.ellipse((cx-99,cy-46,cx+99,cy+28),outline=(219,203,159,255),width=7);d.ellipse((cx-51,cy-29,cx+51,cy+13),outline=(108,193,168,255),width=5)
# light wash
img=Image.alpha_composite(img,Image.new('RGBA',(W,H),(237,215,161,15)))
img.convert('RGB').save('/mnt/data/looteria_rebuild/looteria-assets/kingdom-landscape-hd.webp','WEBP',quality=91,method=6)
print('generated',W,H)
