import Matter from 'matter-js';
import { outline, touchingEdges } from './block-play.mjs';
const { Engine, Bodies, Body, Composite, Sleeping } = Matter;

export function createPhysics() {
  const engine = Engine.create({ enableSleeping: true, positionIterations: 10, velocityIterations: 10 });
  const walls = [Bodies.rectangle(300, 454, 640, 40, { isStatic: true }), Bodies.rectangle(-8, 230, 40, 500, { isStatic: true }), Bodies.rectangle(608, 230, 40, 500, { isStatic: true }), Bodies.rectangle(300, -4, 640, 40, { isStatic: true })];
  Composite.add(engine.world, walls);
  let signature = '', assemblies = [], previous = new Map();
  return {
    step(blocks, links, held, dt = 1 / 120, gravity = 1100) {
      const key = JSON.stringify([blocks.map(b => [b.id, b.width, b.shape]), links, held]);
      if (key !== signature) {
        assemblies.forEach(a => Composite.remove(engine.world, a.body));
        const parent = new Map(blocks.map(b => [b.id, b.id]));
        const root = id => parent.get(id) === id ? id : root(parent.get(id));
        links.forEach(([a,b]) => { if (parent.has(a) && parent.has(b)) parent.set(root(a), root(b)); });
        const groups = new Map();
        blocks.forEach(b => { const r = root(b.id); if (!groups.has(r)) groups.set(r, []); groups.get(r).push(b); });
        assemblies = [...groups.values()].map(group => {
          const centers = group.map(b => Matter.Vertices.centre(outline(b)));
          const parts = group.map((b,i) => {
            const center=centers[i], angle=b.angle||0, c=Math.cos(angle), s=Math.sin(angle);
            const dx=center.x-b.width/2, dy=center.y-21;
            const part=Bodies.fromVertices(b.x+b.width/2+c*dx-s*dy, b.y+21+s*dx+c*dy, [outline(b)], { friction:.65, frictionStatic:1, restitution:.12, frictionAir:.008 });
            Body.setAngle(part, angle);
            return part;
          });
          const body = parts.length === 1 ? parts[0] : Body.create({ parts: [...parts], friction: .65, frictionStatic: 1, restitution: .12, frictionAir: .008 });
          const initialAngle = body.angle;
          const entries = group.map((b,i) => ({ id: b.id, part: parts[i], center: centers[i], offset: (b.angle || 0) - initialAngle }));
          Body.setVelocity(body, { x: group.reduce((v,b)=>v+(b.vx||0),0)/group.length/60, y: group.reduce((v,b)=>v+(b.vy||0),0)/group.length/60 });
          Body.setAngularVelocity(body, group.reduce((v,b)=>v+(b.omega||0),0)/group.length/60);
          if (group.some(b => b.id === held)) Body.setStatic(body, true);
          Composite.add(engine.world, body);
          return { body, entries };
        });
        previous = new Map(blocks.map(b => [b.id, b]));
        signature = key;
      }
      const input = new Map(blocks.map(b => [b.id,b]));
      for (const {body, entries} of assemblies) {
        const changed = entries.find(e => { const b=input.get(e.id), p=previous.get(e.id); return !p || b.x!==p.x || b.y!==p.y || b.angle!==p.angle || b.vx!==p.vx || b.vy!==p.vy || b.omega!==p.omega; });
        if (changed) {
          const b = input.get(changed.id);
          Body.setAngle(body, (b.angle || 0) - changed.offset);
          const angle=b.angle||0, dx=changed.center.x-b.width/2, dy=changed.center.y-21;
          Body.translate(body, { x:b.x+b.width/2+Math.cos(angle)*dx-Math.sin(angle)*dy-changed.part.position.x, y:b.y+21+Math.sin(angle)*dx+Math.cos(angle)*dy-changed.part.position.y });
          Body.setVelocity(body, { x: (b.vx || 0)/60, y: (b.vy || 0)/60 });
          Body.setAngularVelocity(body, (b.omega || 0)/60);
          Sleeping.set(body, false);
        }
      }
      engine.gravity.y = 1;
      engine.gravity.scale = gravity / 1000000;
      Engine.update(engine, dt * 1000);
      const output = new Map();
      for (const {body, entries} of assemblies) for (const e of entries) {
        const b = input.get(e.id), rx=e.part.position.x-body.position.x, ry=e.part.position.y-body.position.y;
        const angle=body.angle+e.offset, dx=e.center.x-b.width/2, dy=e.center.y-21;
        output.set(e.id, { ...b, x:e.part.position.x-b.width/2-Math.cos(angle)*dx+Math.sin(angle)*dy, y:e.part.position.y-21-Math.sin(angle)*dx-Math.cos(angle)*dy, angle, omega:body.angularVelocity*60, vx:(body.velocity.x-body.angularVelocity*ry)*60, vy:(body.velocity.y+body.angularVelocity*rx)*60 });
      }
      const result = blocks.map(b => output.get(b.id));
      previous = new Map(result.map(b => [b.id,b]));
      return result;
    },
  };
}

export function connectionsFor(block, blocks) {
  return blocks.filter(b=>b.id!==block.id && touchingEdges(block,b)).map(b=>[block.id,b.id]);
}
