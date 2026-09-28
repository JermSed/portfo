import fs from 'node:fs';
import assert from 'node:assert/strict';
import ts from 'typescript';
const source=fs.readFileSync(new URL('../src/lib/stick-world/physics.ts',import.meta.url),'utf8');
const {outputText}=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ES2022,target:ts.ScriptTarget.ES2022}});
const {planJump,moveCharacter,rideSurface,orientCharacter}=await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
const figure=(values={})=>({x:50,y:50,vx:0,vy:0,scale:1,grounded:false,platform:null,state:'falling',...values});
const surface={id:1,left:0,right:200,top:100,bottom:180,solid:true,label:'card'};
const falling=figure({vy:900});moveCharacter(falling,.1,[surface],500,800,1100);
assert.equal(falling.y,100);assert.equal(falling.platform,1);assert.equal(falling.grounded,true);
const jumping=figure({y:110,vy:-400});moveCharacter(jumping,.04,[surface],500,800,1100);assert.equal(jumping.grounded,false);
const outside=figure({x:240,y:95,vy:200});moveCharacter(outside,.03,[surface],500,800,1100);assert.equal(outside.platform,null);
const jumper=planJump(50,200,150,140,1100,.8);assert.ok(jumper);
const time=(-jumper.vy+Math.sqrt(jumper.vy**2+2*1100*(140-200)))/1100;
assert.ok(Math.abs(50+jumper.vx*time-150)<.01);
assert.equal(planJump(0,100,800,0,1100,.2),null);
assert.equal(planJump(0,300,10,0,1100,.2),null);
const rider=figure({x:80,y:100,platform:1,grounded:true});rideSurface(rider,[surface],[{...surface,left:20,right:220,top:130}]);assert.equal(rider.x,100);assert.equal(rider.y,130);
rideSurface(rider,[surface],[]);assert.equal(rider.state,'falling');assert.equal(rider.platform,null);
const boundary=figure({x:495,y:790,vx:200,vy:200});moveCharacter(boundary,.1,[],500,800,1100);assert.equal(boundary.x,490);assert.equal(boundary.y,800);
console.log('Passed: platform landing, upward pass-through, missed ledges, ballistic jumps, unreachable targets, moving platforms, disappearing platforms, page bounds.');

const shortArc=planJump(50,200,130,200,1100,.8,.35);
const tallArc=planJump(50,200,130,200,1100,.8,1.5);
assert.ok(shortArc&&tallArc&&tallArc.vy<shortArc.vy);
const descent=planJump(100,200,200,1200,1100,.8,.5);
assert.ok(descent,'Long downward route should be reachable');
const dropTime=(-descent.vy+Math.sqrt(descent.vy**2+2*1100*1000))/1100;
assert.ok(Math.abs(100+descent.vx*dropTime-200)<.01);
console.log('Passed: variable jump arcs and long page descents.');

// Exercise the actual behavior loop for four simulated minutes across disconnected sections.
const surfaces=Array.from({length:6},(_,i)=>({id:i+1,left:40,right:440,top:180+i*700,bottom:600+i*700,solid:true,label:'card',section:`section-${i}`}));
const physicsUrl=`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`;
const routeSource=fs.readFileSync(new URL('../src/lib/stick-world/routes.ts',import.meta.url),'utf8').replace("from './physics'",`from '${physicsUrl}'`);
const routeCode=ts.transpileModule(routeSource,{compilerOptions:{module:ts.ModuleKind.ES2022,target:ts.ScriptTarget.ES2022}}).outputText;
const routeUrl=`data:text/javascript;base64,${Buffer.from(routeCode).toString('base64')}`;
const worldSource=fs.readFileSync(new URL('../src/lib/stick-world/world.ts',import.meta.url),'utf8')
  .replace("import { DOMEnvironment } from './environment';",`class DOMEnvironment {surfaces=${JSON.stringify(surfaces)}; width=480; floor=4500; dirty=false; scan(){return this.surfaces;} invalidate(){} destroy(){}}`)
  .replace("from './physics'",`from '${physicsUrl}'`)
  .replace("from './routes'",`from '${routeUrl}'`)
  .replace("import { drawCharacter, drawDebug } from './renderer';",'const drawCharacter=()=>{};const drawDebug=(_ctx,characters)=>globalThis.captureCharacters(characters);');
const compiled=ts.transpileModule(worldSource,{compilerOptions:{module:ts.ModuleKind.ES2022,target:ts.ScriptTarget.ES2022}}).outputText;
let callback;let samples=[];const listeners=new Map();
Object.assign(globalThis,{innerWidth:480,innerHeight:850,scrollX:0,scrollY:0,devicePixelRatio:1,matchMedia:()=>({matches:false}),requestAnimationFrame:fn=>{callback=fn;return 1;},cancelAnimationFrame:()=>{},window:{addEventListener(name,fn){listeners.set(name,fn);},removeEventListener(name){listeners.delete(name);}},document:{hidden:false,addEventListener(){},removeEventListener(){}},captureCharacters:characters=>{samples=characters;}});
const {createStickWorld}=await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
const context=new Proxy({},{get:()=>()=>{}});
for(const seed of [17,42,91]){
  let random=seed;const originalRandom=Math.random;
  Math.random=()=>{random=(random*16807)%2147483647;return random/2147483647;};
  const world=createStickWorld({getContext:()=>context,style:{},dataset:{}},{debug:true});
  const visited=[new Set(),new Set(),new Set()];
  for(let frame=0;frame<60*240;frame++){
    globalThis.scrollY=Math.min(3500,Math.floor(frame/(60*25))*700);
    callback(frame*1000/60);
    for(const c of samples){assert.ok(Number.isFinite(c.x)&&Number.isFinite(c.y));if(c.grounded&&c.platform>0)visited[c.id].add(c.platform);}
  }
  world.destroy();Math.random=originalRandom;globalThis.scrollY=0;
  for(const stops of visited)assert.ok(stops.size>=4,`Seed ${seed}: character only visited ${stops.size} sections`);
}
console.log('Passed: three seeded four-minute journeys, each character reaches at least four disconnected sections.');

const poseSource=fs.readFileSync(new URL('../src/lib/stick-world/pose.ts',import.meta.url),'utf8');
const poseCode=ts.transpileModule(poseSource,{compilerOptions:{module:ts.ModuleKind.ES2022,target:ts.ScriptTarget.ES2022}}).outputText;
const {solveLimb,poseCharacter}=await import(`data:text/javascript;base64,${Buffer.from(poseCode).toString('base64')}`);
for(const target of [{x:9,y:12},{x:100,y:100},{x:0,y:0}]){
  const [root,joint,end]=solveLimb({x:0,y:0},target,12,12,1);
  assert.ok(Math.abs(Math.hypot(joint.x-root.x,joint.y-root.y)-12)<.001);
  assert.ok(Math.abs(Math.hypot(end.x-joint.x,end.y-joint.y)-12)<.001);
}
const actor=figure({id:0,phase:0,personality:{energy:.6},facing:1,grounded:true,state:'idle'});
const firstPose=poseCharacter(actor,0,{...surface,top:50});
actor.x+=2;
const nextPose=poseCharacter(actor,1/60,{...surface,top:50});
assert.deepEqual(nextPose.feet,firstPose.feet,'Stationary supporting feet should remain planted as the torso shifts');
for(let frame=2;frame<600;frame++){
  actor.vx=Math.sin(frame*.04)*90;actor.x+=actor.vx/60;
  const rig=poseCharacter(actor,frame/60,{...surface,top:50});
  for(const point of [rig.hip,rig.head,...rig.hands,...rig.feet])assert.ok(Number.isFinite(point.x)&&Number.isFinite(point.y));
}
console.log('Passed: fixed limb lengths, planted contacts, finite spring poses under repeated acceleration/reversal.');

const petWorld=createStickWorld({getContext:()=>context,style:{},dataset:{}},{debug:true});
callback(0);const pet=samples[0];const originalX=pet.x,originalY=pet.y;
petWorld.grab(pet.id,pet.x,pet.y-25);
assert.equal(pet.state,'held');assert.equal(pet.platform,null);
petWorld.drag(originalX+70,originalY-100);
assert.equal(pet.x,originalX+70);assert.equal(pet.y,originalY-75);
callback(16);assert.equal(pet.state,'held','Gravity must not move a held character');
petWorld.release();assert.equal(pet.state,'falling');
for(let frame=2;frame<180;frame++)callback(frame*1000/60);
assert.ok(Number.isFinite(pet.x)&&Number.isFinite(pet.y));
petWorld.destroy();
console.log('Passed: pet pickup, grab offset, suspended gravity, release and continued simulation.');

const climber=figure({id:2,x:-10,y:160,phase:0,personality:{energy:.6},facing:1,state:'climbing',climbFrom:{edge:0}});
for(let frame=0;frame<40;frame++){
  climber.y=160-frame*.5;
  const rig=poseCharacter(climber,frame/60,surface);
  for(const point of [...rig.hands,...rig.feet])assert.equal(point.x,0,'Climbing contacts must lie on the visible wall');
  for(const [root,targets,length] of [[rig.shoulder,rig.hands,22],[rig.hip,rig.feet,24]])
    for(const target of targets)assert.ok(Math.hypot(target.x-root.x,target.y-root.y)<=length,'Wall contacts must be within limb reach');
}
const standing=poseCharacter(figure({id:1,phase:0,personality:{energy:.5},facing:1,grounded:true,state:'idle'}),0,{...surface,top:50});
assert.ok(standing.hip.y<29,'Standing legs should be nearly straight');
console.log('Passed: upright standing and reachable hands/feet on actual climbing edges.');

const awarenessWorld=createStickWorld({getContext:()=>context,style:{},dataset:{}},{debug:true,behavior:{socialInteractions:false}});
callback(0);
const aware=samples[0];
const cursorPoint={clientX:aware.x+25,clientY:aware.y-35};
listeners.get('pointermove')(cursorPoint);
callback(16);callback(32);
assert.deepEqual(aware.attention,{x:cursorPoint.clientX,y:cursorPoint.clientY},'Head attention should follow the cursor before an action is chosen');
assert.ok(aware.cursorNotice>0&&aware.cursorNotice<.3,'Cursor perception should have a dwell period');
const reachActor=figure({id:0,phase:0,personality:{energy:.6},facing:1,state:'reaching',grounded:true,attention:{x:500,y:5}});
const reaching=poseCharacter(reachActor,0,{...surface,top:50});
assert.ok(Math.hypot(reaching.hands[1].x-reaching.shoulder.x,reaching.hands[1].y-reaching.shoulder.y)<=20.01,'Curious reach must stay anatomically reachable');
awarenessWorld.destroy();
console.log('Passed: cursor attention precedes reaction and reaching stays within arm length.');

const {planRoute}=await import(routeUrl);
const routeSurfaces=[
  {...surface,id:10,left:40,right:160,top:100,solid:false},
  {...surface,id:11,left:180,right:290,top:145},
  {...surface,id:12,left:70,right:170,top:240},
  {...surface,id:13,left:300,right:410,top:260},
];
for(let id=0;id<3;id++){
  const c=figure({id,x:100,y:180,platform:1,visited:new Set(),personality:{bravery:.8}});
  const route=planRoute(c,routeSurfaces,1100);
  assert.ok(route.length>0&&route.length<=3);
  assert.equal(new Set(route).size,route.length,'A route should not loop through the same stop');
  let x=c.x,y=c.y;
  for(const stop of route){
    const s=routeSurfaces.find(s=>s.id===stop);
    const tx=Math.max(s.left+12,Math.min(s.right-12,x));
    assert.ok(planJump(x,y,tx,s.top,1100,.8,.75),'Every route leg must be physically reachable');
    x=tx;y=s.top;
  }
}
console.log('Passed: each personality receives a reachable three-stop route without repeated stops.');

const turning=figure({facing:1,goal:{x:0,surface:1},state:'looking',intent:{state:'running'}});
orientCharacter(turning);assert.equal(turning.facing,-1,'Turn before a planned run');
turning.jump={vx:120,vy:-250};orientCharacter(turning,'anticipating');
assert.equal(turning.facing,1,'Anticipation faces the actual launch direction');
turning.vx=-80;turning.vy=200;orientCharacter(turning,'falling');
assert.equal(turning.facing,-1,'Falling follows horizontal momentum');
assert.ok(turning.attention.y>turning.y-39,'Descending head looks down toward landing');
turning.vx=.2;orientCharacter(turning,'falling');
assert.equal(turning.facing,-1,'Vertical drops must not flicker left/right');
console.log('Passed: pre-move turns, launch direction, airborne facing, downward attention, and vertical-drop stability.');

for(const drop of [20,60,300]){
  const motion=planJump(100,200,110,200+drop,1100,.8,.8);
  assert.ok(motion);
  assert.equal(motion.vy,0,'Descending transfers should not launch upward');
}
const stepActor=figure({id:0,phase:0,personality:{energy:.6},facing:1,state:'stepping',grounded:true,timer:.24,stepFrom:{x:50,y:50,targetX:65,targetY:38,surface:1}});
const stepRig=poseCharacter(stepActor,0,{...surface,top:50});
assert.equal(stepRig.feet[1].y,50,'Trailing foot remains on the old support during the first part of a step');
assert.ok(stepRig.feet[0].y<50,'Leading foot lifts toward the new support');
console.log('Passed: descending transfers have no upward launch and short steps retain a planted trailing foot.');
