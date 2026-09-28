import type { Character, Cursor, Surface } from './types';
import { poseCharacter, solveLimb, type Point } from './pose';
export function drawCharacter(ctx:CanvasRenderingContext2D,c:Character,_cursor:Cursor,time:number,surface?:Surface) {
  const rig=poseCharacter(c,time,surface);
  ctx.save();ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle=c.color;
  const line=(points:Point[],width=2.7)=>{ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.lineWidth=width;ctx.stroke();};
  rig.feet.forEach((foot)=>line(solveLimb(rig.hip,foot,12*c.scale,12*c.scale,-c.facing)));
  line([rig.hip,rig.shoulder],3);
  rig.hands.forEach((hand)=>line(solveLimb(rig.shoulder,hand,11*c.scale,11*c.scale,c.facing)));
  ctx.beginPath();ctx.ellipse(rig.head.x,rig.head.y,5.5*c.scale,5.8*c.scale,rig.tilt,0,Math.PI*2);ctx.lineWidth=2.7;ctx.stroke();
  ctx.restore();
}
export function drawDebug(ctx:CanvasRenderingContext2D,characters:Character[],surfaces:Surface[],gravity:number) {
  ctx.save();ctx.font='10px monospace';ctx.lineWidth=1;
  for(const s of surfaces){ctx.strokeStyle='#e6c56f55';ctx.strokeRect(s.left,s.top,s.right-s.left,Math.max(1,s.bottom-s.top));ctx.fillStyle='#e6c56f';ctx.fillText(String(s.id),s.left+2,s.top-3);}
  for(const c of characters){ctx.strokeStyle=c.color;ctx.fillStyle=c.color;ctx.fillText(`${c.id}: ${c.state}`,c.x+12,c.y-46);ctx.beginPath();ctx.moveTo(c.x,c.y);ctx.lineTo(c.x+c.vx*.25,c.y+c.vy*.25);ctx.stroke();
    if(c.goal){const target=surfaces.find(s=>s.id===c.goal?.surface);if(target){ctx.setLineDash([3,4]);ctx.beginPath();ctx.moveTo(c.x,c.y);ctx.lineTo(c.goal.x,target.top);ctx.stroke();ctx.setLineDash([]);}}
    if(c.jump){ctx.beginPath();for(let t=0;t<.8;t+=.025){const x=c.x+c.jump.vx*t,y=c.y+c.jump.vy*t+gravity*t*t/2;if(t===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();}
  }
  ctx.restore();
}
