import type { Character, Surface } from './types';
export const clamp=(v:number,a:number,b:number)=>Math.max(a,Math.min(b,v));
export function planJump(x:number,y:number,targetX:number,targetY:number,gravity:number,bravery:number,style=1) {
  const height=y-targetY;
  if(height>65+bravery*70 || Math.abs(targetX-x)>100+bravery*150 || height < -1800) return null;
  // Descents need gravity, not an upward launch. Level gaps get a modest arc.
  const gap=Math.abs(targetX-x);
  const rise=height < -12 ? 0 : Math.max(gravity*(gap/240)**2/8,8+Math.min(18,gap*.09)*style,height+8+6*style);
  const vy=rise===0?0:-Math.sqrt(2*gravity*rise);
  const discriminant=vy*vy+2*gravity*(targetY-y);
  if(discriminant<0) return null;
  const time=(-vy+Math.sqrt(discriminant))/gravity;
  const vx=(targetX-x)/time;
  return Math.abs(vx)>260 ? null : {vx,vy};
}
export function moveCharacter(c:Character,dt:number,surfaces:Surface[],width:number,floor:number,gravity:number) {
  const oldX=c.x, oldY=c.y;
  c.vy+=gravity*dt;
  c.x=clamp(c.x+c.vx*dt,10,width-10);
  c.y+=c.vy*dt;
  if(c.y<48){c.y=48;c.vy=Math.max(0,c.vy);}
  c.grounded=false;
  let landing:Surface|undefined;
  if(c.vy>=0) landing=surfaces.filter(s=>c.x>=s.left+3 && c.x<=s.right-3 && oldY<=s.top+2 && c.y>=s.top).sort((a,b)=>a.top-b.top)[0];
  if(landing) { c.y=landing.top;c.vy=0;c.platform=landing.id;c.grounded=true; }
  else if(c.y>=floor) { c.y=floor;c.vy=0;c.platform=-1;c.grounded=true; }
  else c.platform=null;
  for(const s of surfaces) {
    if(!s.solid || s.id===c.platform || c.y<s.top+10 || c.y-35*c.scale>s.bottom) continue;
    if(oldX<=s.left-5 && c.x>s.left-5) { c.x=s.left-5;c.vx=0; }
    else if(oldX>=s.right+5 && c.x<s.right+5) { c.x=s.right+5;c.vx=0; }
  }
}
export function rideSurface(c:Character,previous:Surface[],next:Surface[]) {
  if(c.platform===null || c.platform===-1) return;
  const old=previous.find(s=>s.id===c.platform), current=next.find(s=>s.id===c.platform);
  if(!current) {c.platform=null;c.grounded=false;c.state='falling';c.vy=0;return;}
  if(old) {c.x+=current.left-old.left;c.y+=current.top-old.top;}
  if(c.grounded)c.x=clamp(c.x,current.left+5,current.right-5);
}

// Locomotion owns facing; idle attention can still follow the cursor or a friend.
export function orientCharacter(c:Character,nextState=c.intent?.state??c.state) {
  const preparing=nextState==='anticipating';
  const traveling=nextState==='walking'||nextState==='running';
  const airborne=['jumping','falling','startled'].includes(nextState);
  if(!preparing&&!traveling&&!airborne)return;
  const direction=preparing?(c.jump?.vx??0):airborne?c.vx:(c.goal?.x??c.x)-c.x;
  // Preserve facing for vertical drops and tiny corrections near a destination.
  if(Math.abs(direction)>2)c.facing=Math.sign(direction);
  c.attention={
    x:c.x+c.facing*65,
    y:airborne?c.y-39+clamp(c.vy*.09,-28,40):preparing?c.y-58:c.y-39,
  };
}
