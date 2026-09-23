export const BOARD = { width: 600, height: 460, heightBlock: 42, stud: 24 };
export const initialBlocks = [
  { id: 'blue', name: 'Cobalt', x: 96, y: 270, width: 144, color: '#7895d5' },
  { id: 'cream', name: 'Ivory', x: 120, y: 228, width: 96, color: '#e4ddcb' },
  { id: 'sage', name: 'Sage', x: 312, y: 302, width: 144, color: '#91aaa0' },
  { id: 'rose', name: 'Rose', x: 360, y: 260, width: 96, color: '#bf8f93' },
  { id: 'plum', name: 'Lilac', x: 348, y: 108, width: 96, color: '#b3a1c9' },
  { id: 'gold', name: 'Ochre', x: 132, y: 112, width: 48, color: '#c6ae79' },
  { id: 'slate', name: 'Slate', x: 252, y: 364, width: 96, color: '#8797a3' },
];
export function outline(b) {
  if (b.shape === 'roof' || b.shape === 'nose') return [{x:0,y:42},{x:b.width/2,y:0},{x:b.width,y:42}];
  if (b.shape === 'wing') return [{x:0,y:42},{x:b.width,y:0},{x:b.width,y:42}];
  return [{x:0,y:0},{x:b.width,y:0},{x:b.width,y:42},{x:0,y:42}];
}
export function hasStuds(b) { return !['roof','nose','wing'].includes(b.shape); }
export function corners(b) {
  const c = Math.cos(b.angle || 0), s = Math.sin(b.angle || 0);
  return outline(b).map(p => { const x=p.x-b.width/2, y=p.y-21; return { x:b.x+b.width/2+c*x-s*y, y:b.y+21+s*x+c*y }; });
}
export function constrain(block) {
  const points = corners(block);
  const minX=Math.min(...points.map(p=>p.x)), maxX=Math.max(...points.map(p=>p.x));
  const minY=Math.min(...points.map(p=>p.y)), maxY=Math.max(...points.map(p=>p.y));
  return { ...block, x:block.x+Math.max(0,12-minX)-Math.max(0,maxX-588), y:block.y+Math.max(0,24-minY)-Math.max(0,maxY-434) };
}
export function overlaps(a,b) {
  const pa=corners(a), pb=corners(b);
  for (const polygon of [pa,pb]) for (let i=0;i<polygon.length;i++) {
    const p=polygon[i], q=polygon[(i+1)%polygon.length];
    const axis=Math.atan2(q.y-p.y,q.x-p.x)+Math.PI/2;
    const project = p => p.x*Math.cos(axis)+p.y*Math.sin(axis);
    const aa=pa.map(project), bb=pb.map(project);
    if (Math.min(Math.max(...aa),Math.max(...bb))-Math.max(Math.min(...aa),Math.min(...bb))<.1) return false;
  }
  return true;
}
export function edges(block) {
  const points=corners(block);
  return points.map((a,i)=>({a,b:points[(i+1)%points.length],index:i}));
}
export function touchingEdges(a,b) {
  for(const e of edges(a)) for(const f of edges(b)) {
    const dx=e.b.x-e.a.x, dy=e.b.y-e.a.y, length=Math.hypot(dx,dy), ux=dx/length, uy=dy/length;
    const distance=p=>Math.abs((p.x-e.a.x)*uy-(p.y-e.a.y)*ux);
    const project=p=>(p.x-e.a.x)*ux+(p.y-e.a.y)*uy;
    if(distance(f.a)<.5 && distance(f.b)<.5 && Math.min(length,Math.max(project(f.a),project(f.b)))-Math.max(0,Math.min(project(f.a),project(f.b)))>4) return true;
  }
  return false;
}
export function snapBlock(block, blocks) {
  let best=null, score=28;
  for(const other of blocks.filter(b=>b.id!==block.id)) for(const target of edges(other)) for(const source of edges(block)) {
    const ta=Math.atan2(target.b.y-target.a.y,target.b.x-target.a.x);
    const sa=Math.atan2(source.b.y-source.a.y,source.b.x-source.a.x);
    const turn=Math.atan2(Math.sin(ta+Math.PI-sa),Math.cos(ta+Math.PI-sa));
    if(Math.abs(turn)>.65) continue;
    const rotated={...block,angle:(block.angle||0)+turn};
    const edge=edges(rotated)[source.index];
    const sx=(edge.a.x+edge.b.x)/2, sy=(edge.a.y+edge.b.y)/2;
    const tx=(target.a.x+target.b.x)/2, ty=(target.a.y+target.b.y)/2;
    const ux=Math.cos(ta), uy=Math.sin(ta);
    const extent=(Math.hypot(target.b.x-target.a.x,target.b.y-target.a.y)+Math.hypot(edge.b.x-edge.a.x,edge.b.y-edge.a.y))/2-12;
    const slide=Math.max(-extent,Math.min(extent,Math.round(((sx-tx)*ux+(sy-ty)*uy)/12)*12));
    const candidate={...rotated,x:rotated.x+tx+ux*slide-sx,y:rotated.y+ty+uy*slide-sy};
    const d=Math.hypot(candidate.x-block.x,candidate.y-block.y)+Math.abs(turn)*8;
    const bounded=constrain(candidate);
    if(d<score && Math.abs(bounded.x-candidate.x)<.01 && Math.abs(bounded.y-candidate.y)<.01 && !blocks.some(b=>b.id!==block.id && overlaps(candidate,b))) {
      best={...candidate,snapEdge:source.index,targetEdge:target.index,targetId:other.id}; score=d;
    }
  }
  return best;
}
