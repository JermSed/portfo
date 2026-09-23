import test from 'node:test';
import assert from 'node:assert/strict';
import { createPhysics, connectionsFor } from './block-physics.mjs';
import { initialBlocks, corners, snapBlock } from './block-play.mjs';

test('gravity settles connected assemblies inside the board', () => {
  const stepPhysics = createPhysics().step;
  let blocks = initialBlocks.map(b => ({ ...b }));
  for (let i = 0; i < 1200; i++) blocks = stepPhysics(blocks, [['blue', 'cream'], ['sage', 'rose']], null);
  assert.ok(blocks.every(b => corners(b).every(p => p.y <= 434.5 && p.x >= 11.5 && p.x <= 588.5)));
  assert.ok(blocks.every(b => Math.abs(b.vy) < 3));
  assert.ok(Math.abs(Math.hypot(blocks[0].x+72-blocks[1].x-48, blocks[0].y-blocks[1].y)-42)<.1);
  /* Collision slop allows a fraction of a pixel at rest. */
  for (const a of blocks) for (const b of blocks) if (a.id !== b.id) {
    let separation = false;
    for (const angle of [a.angle||0,b.angle||0]) for (const axis of [angle,angle+Math.PI/2]) {
      const project = p => p.x*Math.cos(axis)+p.y*Math.sin(axis);
      const aa=corners(a).map(project), bb=corners(b).map(project);
      if (Math.min(Math.max(...aa),Math.max(...bb))-Math.max(Math.min(...aa),Math.min(...bb))<.5) separation=true;
    }
    assert.ok(separation, 'resting bodies must not significantly penetrate');
  }
});
test('throws bounce off walls and settle; grabbing suspends gravity', () => {
  const stepPhysics = createPhysics().step;
  let blocks = [{ id: 'a', x: 500, y: 100, width: 48, vx: 700, vy: -200 }];
  for (let i = 0; i < 600; i++) blocks = stepPhysics(blocks, [], null);
  assert.ok(blocks[0].x + 48 <= 588.1);
  assert.ok(Math.max(...corners(blocks[0]).map(p=>p.y)) <= 434.5);
  const held = stepPhysics([{ id: 'a', x: 100, y: 100, width: 48 }], [], 'a');
  assert.equal(held[0].y, 100);
});
test('touching edges connect without requiring stud alignment', () => {
  const base = { id: 'base', x: 100, y: 200, width: 96 };
  assert.deepEqual(connectionsFor({ id: 'top', x: 124, y: 158, width: 48 }, [base]), [['top','base']]);
  assert.deepEqual(connectionsFor({ id: 'top', x: 130, y: 150, width: 48 }, [base]), []);
});

test('an off-center landing produces torque and tips a beam off a pivot', () => {
  const physics=createPhysics();
  let blocks=[{id:'pivot',x:260,y:300,width:48},{id:'beam',x:270,y:190,width:144}];
  let tilt=0;
  for(let i=0;i<240;i++) { blocks=physics.step(blocks,[],'pivot'); tilt=Math.max(tilt,Math.abs(blocks[1].angle)); }
  assert.ok(tilt>.3, `expected tilt, got ${tilt}`);
});
test('snapping follows a rotated edge', () => {
  const base={id:'base',x:200,y:200,width:96,angle:.3};
  const candidate={id:'top',x:200+Math.sin(.3)*42,y:200-Math.cos(.3)*42,width:96};
  const snap=snapBlock(candidate,[base]);
  assert.ok(snap);
  assert.ok(Math.abs(snap.angle-.3)<1e-8);
  assert.deepEqual(connectionsFor(snap,[base]),[['top','base']]);
});
test('triangular pieces retain their geometry through gravity and rotation', () => {
  const physics=createPhysics();
  let blocks=[{id:'roof',x:200,y:80,width:96,shape:'roof',angle:.4},{id:'nose',x:400,y:140,width:48,shape:'nose'}];
  for(let i=0;i<900;i++) blocks=physics.step(blocks,[],null);
  for(const block of blocks) {
    assert.equal(corners(block).length,3);
    assert.ok(corners(block).every(p=>p.y<=434.5 && p.x>=11.5 && p.x<=588.5));
  }
  const base={id:'base',x:200,y:250,width:96};
  const roof=snapBlock({id:'roof',x:200,y:208,width:96,shape:'roof'},[base]);
  assert.ok(roof);
  assert.deepEqual(connectionsFor(roof,[base]),[['roof','base']]);
  assert.equal(snapBlock({id:'top',x:200,y:166,width:96},[roof]),null);
});

test('a wing attaches to the side and remains rigid under gravity', () => {
  const base={id:'base',x:250,y:200,width:48};
  const wing={id:'wing',x:203,y:200,width:48,shape:'wing'};
  const snap=snapBlock(wing,[base]);
  assert.ok(snap);
  assert.ok(Math.abs(snap.x-202)<.01);
  assert.deepEqual(connectionsFor(snap,[base]),[['wing','base']]);
  const physics=createPhysics();
  let blocks=[base,snap];
  for(let i=0;i<300;i++) blocks=physics.step(blocks,[['wing','base']],null);
  assert.ok(Math.abs(Math.hypot(blocks[0].x-blocks[1].x,blocks[0].y-blocks[1].y)-48)<.1);
});
