import { planJump } from './physics';
import type { Character, Surface } from './types';

// Blue explores high ledges, lilac crosses between neighbors, sage follows artwork.
export function planRoute(c:Character,surfaces:Surface[],gravity:number):number[]{
  const route:number[]=[];
  let x=c.x,y=c.y;
  const used=new Set([c.platform,...c.visited]);
  for(let step=0;step<3;step++){
    const options=surfaces.filter(s=>s.id!==c.platform&&!route.includes(s.id)).map(s=>{
      const tx=Math.max(s.left+12,Math.min(s.right-12,x));
      const jump=planJump(x,y,tx,s.top,gravity,c.personality.bravery,.75);
      const preference=c.id===0?(s.top-y)*.3:c.id===1?-Math.abs(tx-x)*.35:(s.solid?-65:35);
      return {s,tx,jump,score:Math.hypot(tx-x,s.top-y)*.35+preference+(used.has(s.id)?180:0)};
    }).filter(o=>o.jump&&Math.hypot(o.tx-x,o.s.top-y)>20).sort((a,b)=>a.score-b.score);
    if(!options.length)break;
    const next=options[0];route.push(next.s.id);used.add(next.s.id);x=next.tx;y=next.s.top;
  }
  return route;
}
