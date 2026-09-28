import type { Character, Surface } from './types';
export type Point={x:number;y:number};
type Spring={value:number;velocity:number};
type Foot={x:number;start:number;target:number;phase:number;moving:boolean};
export type Rig={hip:Point;shoulder:Point;head:Point;tilt:number;feet:Point[];hands:Point[]};
type Memory={hands?:{x:Spring;y:Spring}[];grips?:Point[];gripSide?:number;lean:Spring;lift:Spring;head:Spring;pitch?:Spring;vx:number;feet:Foot[];lastX:number;lastY:number;wasGrounded:boolean;nextFoot:number;time:number};
const memories=new WeakMap<Character,Memory>();
const clamp=(v:number,a:number,b:number)=>Math.max(a,Math.min(b,v));
function spring(s:Spring,target:number,dt:number,stiffness=150,damping=21){
  for(let remaining=dt;remaining>0;){const h=Math.min(remaining,1/120);s.velocity+=((target-s.value)*stiffness-s.velocity*damping)*h;s.value+=s.velocity*h;remaining-=h;}
  return s.value;
}
// Analytic two-bone IK keeps limb lengths fixed even when the requested contact is unreachable.
export function solveLimb(root:Point,target:Point,a:number,b:number,bend:number):[Point,Point,Point]{
  const dx=target.x-root.x,dy=target.y-root.y,raw=Math.hypot(dx,dy),d=clamp(raw,.001,a+b-.001);
  const ux=raw>.001?dx/raw:0,uy=raw>.001?dy/raw:1;
  const along=(a*a-b*b+d*d)/(2*d),height=Math.sqrt(Math.max(0,a*a-along*along));
  return [root,{x:root.x+ux*along-uy*height*bend,y:root.y+uy*along+ux*height*bend},{x:root.x+ux*d,y:root.y+uy*d}];
}
export function poseCharacter(c:Character,time:number,surface?:Surface):Rig{
  const initial=()=>({value:0,velocity:0});
  const m=memories.get(c)??{lean:initial(),lift:initial(),head:initial(),vx:c.vx,feet:[-5,5].map(offset=>({x:c.x+offset,start:c.x+offset,target:c.x+offset,phase:0,moving:false})),lastX:c.x,lastY:c.y,wasGrounded:c.grounded,nextFoot:0,time};
  const dt=clamp(time-m.time,0,.05);m.time=time;memories.set(c,m);
  const acceleration=dt>0?(c.vx-m.vx)/dt:0;m.vx=c.vx;
  const climb=c.state==='climbing',hang=c.state==='hanging'||c.state==='held',sit=c.state==='sitting'||c.state==='sleeping';
  const anticipation=c.state==='anticipating';
  if(c.grounded&&!m.wasGrounded){m.lift.velocity=Math.min(110,(c.impact??180)*.18);for(const [i,f] of m.feet.entries()){f.x=c.x+(i?5:-5);f.moving=false;}}
  const attention=clamp(((c.attention?.x??c.goal?.x??c.x+c.facing*80)-c.x)/85,-1,1);
  const headTurn=spring(m.head,attention,dt,220,27);
  m.pitch??={value:0,velocity:0};
  const pitch=spring(m.pitch,clamp(((c.attention?.y??c.y-40)-(c.y-40))/100,-1,1),dt,170,23);
  const lean=spring(m.lean,clamp(c.vx*.023+acceleration*.006,-4.5,4.5)+(c.intent?attention*1.6:0),dt,100,15);
  const compression=spring(m.lift,anticipation?7:sit?12:climb?Math.sin(c.phase*2)*1.2:0,dt,170,20);
  const speed=Math.abs(c.vx),run=clamp((speed-55)/45,0,1);
  const breathe=Math.sin(time*(1.9+c.personality.energy*.4)+c.id)*.18;
  const hip={x:c.x+lean*.35,y:c.y-23*c.scale+compression+breathe};
  const shoulder={x:hip.x+lean+(climb?c.facing*2:0),y:hip.y-16*c.scale};
  const head={x:shoulder.x+headTurn*2.6,y:shoulder.y-8.5*c.scale+pitch*1.8};
  const feet:Point[]=[];
  const supportY=surface?.top??c.y;
  if(c.grounded&&!sit){
    // Planted feet stay in document coordinates. Only the swinging foot follows an arc.
    for(const [i,f] of m.feet.entries()){
      if(Math.abs(c.x-m.lastX)>60){f.x=c.x+(i?5:-5);f.moving=false;}
      if(!f.moving&&!m.feet[1-i].moving&&i===m.nextFoot&&(Math.abs(f.x-c.x)>9||Math.abs(c.vx)>12)){
        f.moving=true;f.phase=0;f.start=f.x;f.target=c.x+clamp(c.vx*.12,-12,12);
        if(surface)f.target=clamp(f.target,surface.left+2,surface.right-2);
      }
      if(f.moving){f.phase=Math.min(1,f.phase+dt*(4+speed*.055));const t=f.phase*f.phase*(3-2*f.phase);f.x=f.start+(f.target-f.start)*t;if(f.phase===1){f.moving=false;m.nextFoot=1-i;}}
      feet.push({x:f.x,y:supportY-Math.sin(f.phase*Math.PI)*(f.moving?4+run*5:0)});
    }
  }else for(let i=0;i<2;i++)feet.push({x:c.x+(i?7:-7)+Math.sin(time*3+i)* (hang?3:0),y:sit?c.y+13+Math.sin(time*2.8+i*.8)*2:climb?c.y-3-Math.sin(c.phase+i*Math.PI)*5:c.y-(c.vy<0?8:2)});
  if(c.grounded&&!sit){
    // Lower the pelvis only as far as a planted leg requires; standing remains tall.
    const required=Math.max(...feet.map(f=>f.y-Math.sqrt(Math.max(1,(23.8*c.scale)**2-(f.x-hip.x)**2))));
    const settle=Math.max(0,required-hip.y);
    hip.y+=settle;shoulder.y+=settle;head.y+=settle;
  }
  let hands:Point[]=[{x:shoulder.x-4-lean*.6,y:hip.y+3},{x:shoulder.x+4-lean*.6,y:hip.y+3}];
  if(c.grounded&&Math.abs(c.vx)>5)hands=hands.map((p,i)=>({x:p.x+(feet[i].x-c.x)*-(.8+run*.3),y:p.y-Math.abs(lean)*.3}));
  if(!c.grounded&&!climb&&!hang)hands=[{x:shoulder.x-14,y:shoulder.y-3-clamp(c.vy/90,-3,7)},{x:shoulder.x+14,y:shoulder.y-5}];
  if(anticipation)hands=[{x:shoulder.x-c.facing*12-3,y:hip.y},{x:shoulder.x-c.facing*8+5,y:hip.y-2}];
  if(climb&&surface){
    const edge=c.climbFrom?.edge??(Math.abs(c.x-surface.left)<Math.abs(c.x-surface.right)?surface.left:surface.right);
    const mantle=clamp((surface.top+30-c.y)/30,0,1);
    for(let i=0;i<2;i++){
      // Each limb holds a world-space rung while the body advances, then reaches
      // for its next contact. Every rung lies on the actual visible card edge.
      const rung=(offset:number)=>{
        const phase=(c.y-offset+i*8)/16,base=Math.floor(phase),fraction=phase-base;
        const t=clamp((fraction-.7)/.3,0,1);
        return Math.max(surface.top,(base+t*t*(3-2*t))*16-i*8);
      };
      feet[i]={x:edge+(c.x-edge)*mantle,y:rung(8)*(1-mantle)+surface.top*mantle};
    }
    hands=[0,1].map(i=>({x:edge,y:Math.max(surface.top,Math.ceil((c.y-48+i*10)/20)*20-i*10)}));
  }else if(hang){
    const top=surface?.top??c.y-48;
    hands=[{x:c.x-5,y:top},{x:c.x+5,y:top}];
  }
  if(c.state==='waving')hands[1]={x:shoulder.x+11+Math.sin(time*9)*3,y:shoulder.y-13};
  if(c.intent&&!climb&&!hang)hands[1]={x:shoulder.x+headTurn*10,y:shoulder.y+9};
  if(!m.hands)m.hands=hands.map(p=>({x:{value:p.x,velocity:0},y:{value:p.y,velocity:0}}));
  if(!hang&&!climb)hands=hands.map((p,i)=>({x:spring(m.hands![i].x,p.x,dt,climb?280:180,25),y:spring(m.hands![i].y,p.y,dt,climb?280:180,25)}));
  else m.hands=hands.map(p=>({x:{value:p.x,velocity:0},y:{value:p.y,velocity:0}}));
  m.lastX=c.x;m.lastY=c.y;m.wasGrounded=c.grounded;
  return {hip,shoulder,head,feet,hands,tilt:headTurn*.15+pitch*.12+lean*.015+(c.intent?Math.sin(time*2)*.08:0)};
}
