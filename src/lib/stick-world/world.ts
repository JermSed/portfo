import { planRoute } from './routes';
import { DOMEnvironment } from './environment';
import { clamp, moveCharacter, planJump, rideSurface, orientCharacter } from './physics';
import { drawCharacter, drawDebug } from './renderer';
import type { Character, Config, Cursor, State, Surface } from './types';
export type { Config } from './types';
const PALETTE=['#90a9d6','#b9a4ce','#9fbbb0'];
const PERSONALITIES=[
  {curiosity:.9,energy:.75,bravery:.8,sociability:.65,playfulness:.85},
  {curiosity:.65,energy:.5,bravery:.45,sociability:.95,playfulness:.6},
  {curiosity:.4,energy:.35,bravery:.3,sociability:.65,playfulness:.4},
];
export function createStickWorld(canvas:HTMLCanvasElement,config:Config={}) {
  const ctx=canvas.getContext('2d');if(!ctx) return {destroy(){},setPaused(_paused:boolean){},setDebug(_debug:boolean){},grab(_id:number,_x:number,_y:number){},drag(_x:number,_y:number){},release(){},greet(_id:number){}};
  const environment=new DOMEnvironment();
  const physics={gravity:1100,walkSpeed:48,runSpeed:105,...config.physics};
  const behavior={cursorAwareness:true,socialInteractions:true,climbing:true,rareEvents:true,...config.behavior};
  const characters:Character[]=[];
  const cursor:Cursor={x:0,y:0,speed:0,active:false,lastMoved:0};
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let frame=0,last=0,lastScan=0,time=0,paused=false,debug=config.debug||false,destroyed=false,dpr=1;
  let nextEvent=3;
  let lastPaint=0;
  let held:Character|undefined;let grabOffset={x:0,y:0};let lastDrag=0;
  const state=(c:Character,value:State,duration=1)=>{
    orientCharacter(c,value);
    if(c.grounded&&!c.intent&&['walking','running','anticipating','waving','reaching'].includes(value)&&c.state!==value){
      c.attention={x:c.goal?.x??c.attention?.x??c.x+c.facing*70,y:c.attention?.y??environment.surfaces.find(s=>s.id===c.goal?.surface)?.top??c.y-25};
      orientCharacter(c,value);
      c.intent={state:value,duration,remaining:.22+(1-c.personality.bravery)*.3+Math.random()*.16};
      c.state='looking';c.timer=c.intent.remaining;return;
    }
    c.state=value;c.timer=duration;
  };
  const visible=(c:Character)=>c.y>scrollY-90&&c.y<scrollY+innerHeight+100;
  function resize(){dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(innerWidth*dpr);canvas.height=Math.round(innerHeight*dpr);canvas.style.width=`${innerWidth}px`;canvas.style.height=`${innerHeight}px`;environment.invalidate();}
  function spawn(){
    const surfaces=environment.scan();
    const available=surfaces.filter(s=>s.top>scrollY+100&&s.top<scrollY+innerHeight-30&&s.right-s.left>80);
    const preferred=available.filter(s=>s.label==='h1'||s.label==='h2'||s.label==='svg'||s.solid);
    const places=preferred.length?preferred:available;
    for(let i=0;i<clamp(config.characters??3,1,3);i++){
      const surface=places[i%Math.max(1,places.length)];
      const x=surface?clamp(surface.left+(surface.right-surface.left)*(.25+i*.18),surface.left+12,surface.right-12):80+i*65;
      characters.push({id:i,color:PALETTE[i],scale:1,personality:PERSONALITIES[i],x,y:surface?.top??environment.floor,vx:0,vy:0,facing:i===1?-1:1,state:'looking',timer:.8+Math.random()*3,phase:Math.random()*6,socialAt:4+Math.random()*6,platform:surface?.id??-1,goal:null,jump:null,visited:new Set(),cooldown:4,lookX:x,grounded:true});
    }
  }
  function choose(c:Character){
    const platform=environment.surfaces.find(s=>s.id===c.platform) || (c.platform===-1 ? {id:-1,left:0,right:environment.width,top:environment.floor,bottom:environment.floor,solid:false,label:'floor'} : undefined);
    if(!platform){state(c,'idle',1);c.vx=0;return;}
    c.visited.add(platform.id);
    if(c.visited.size>18)c.visited.delete(c.visited.values().next().value!);
    const friend=c.chase&&c.chase.until>time?characters.find(b=>b.id===c.chase?.id):undefined;
    const threat=c.flee&&c.flee.until>time?characters.find(b=>b.id===c.flee?.id):undefined;
    const places=environment.surfaces.filter(s=>s.label!=='nav'&&s.right-s.left>35&&(!visible(c)||(s.top>scrollY+65&&s.top<scrollY+innerHeight-12)));
    c.route=(c.route??[]).filter(id=>id!==platform.id&&places.some(s=>s.id===id));
    if(!c.route.length)c.route=planRoute(c,places,physics.gravity);
    if(friend?.platform!=null&&time-(c.sectionSince??0)<12)c.destination=friend.platform;
    const section=platform.section??'intro';
    if(c.lastSection!==section){
      c.recentSections=[...(c.recentSections??[]),section].slice(-4);c.lastSection=section;c.sectionSince=time;
    }
    if(!c.destination||c.destination===platform.id||time>(c.journeyUntil??0)||!places.some(s=>s.id===c.destination)){
      let direction=c.travelDirection??1;
      const sections=[...new Set(places.map(s=>s.section??'intro'))];
      const index=sections.indexOf(section);
      if(index>=sections.length-1)direction=-1;else if(index<=0)direction=1;
      c.travelDirection=direction;
      const nextSection=sections[clamp(index+direction,0,sections.length-1)];
      const pool=places.filter(s=>s.section===nextSection&&s.id!==platform.id);
      const choices=(pool.length?pool:places.filter(s=>s.id!==platform.id)).sort((a,b)=>Math.abs(a.top-c.y)-Math.abs(b.top-c.y));
      c.destination=choices[Math.floor(Math.random()*Math.min(3,choices.length))]?.id;
      c.journeyUntil=time+18+Math.random()*8;
    }
    const destination=places.find(s=>s.id===c.destination);
    const walls=places.filter(s=>s.solid&&s.id!==platform.id&&!c.visited.has(s.id)&&c.y-s.top>36&&c.y-s.top<650&&s.bottom>=c.y-50&&Math.min(Math.abs(c.x-s.left),Math.abs(c.x-s.right))<45&&(!destination||Math.abs(s.top-destination.top)<Math.abs(c.y-destination.top)));
    if(behavior.climbing&&walls.length){
      const wall=walls[0];const edge=Math.abs(c.x-wall.left)<Math.abs(c.x-wall.right)?wall.left:wall.right;
      c.climbFrom={x:c.x,y:c.y,duration:1.2+(c.y-wall.top)/55,edge};c.goal={x:edge,surface:wall.id};c.platform=wall.id;c.grounded=false;c.vx=c.vy=0;state(c,'climbing',c.climbFrom.duration);return;
    }
    c.jumpStyle=.55+c.personality.energy*.4+Math.random()*.25;
    const candidates=places.filter(s=>s.id!==platform.id).map(s=>{
      const x=clamp(friend?.platform===s.id?friend.x:c.x+(Math.random()-.5)*100,s.left+12,s.right-12);
      const jump=planJump(c.x,c.y,x,s.top,physics.gravity,c.personality.bravery,c.jumpStyle);
      return {s,x,jump,score:(s.id===c.route?.[0]?-160:0)+Math.hypot(x-c.x,s.top-c.y)*.2+(destination?Math.hypot(x-(destination.left+destination.right)/2,s.top-destination.top)*.8:0)+(c.visited.has(s.id)?180:0)+(threat?-Math.hypot(x-threat.x,s.top-threat.y)*.7:0)+Math.random()*70};
    }).filter(t=>t.jump && Math.hypot(t.x-c.x,t.s.top-c.y)>4).sort((a,b)=>a.score-b.score);
    if(candidates.length&&(friend||threat||Math.random()<.35+c.personality.curiosity*.2)){
      const target=candidates[friend||threat?0:Math.floor(Math.random()*Math.min(2,candidates.length))];
      const rise=c.y-target.s.top,gap=Math.abs(target.x-c.x);
      if(gap<26&&Math.abs(rise)<=18){
        c.stepFrom={x:c.x,y:c.y,targetX:target.x,targetY:target.s.top,surface:target.s.id};
        c.goal={x:target.x,surface:target.s.id};c.vx=c.vy=0;
        state(c,'stepping',.48);return;
      }
      if(rise>18&&rise<46&&gap<28&&target.s.solid){
        const edge=Math.abs(c.x-target.s.left)<Math.abs(c.x-target.s.right)?target.s.left:target.s.right;
        if(Math.abs(c.x-edge)<24){
          c.goal={x:target.x,surface:target.s.id};c.platform=target.s.id;c.grounded=false;c.vx=c.vy=0;
          c.climbFrom={x:c.x,y:c.y,duration:1.2,edge};state(c,'climbing',1.2);return;
        }
      }
      if(target.s.top>c.y+50&&platform.id!==-1){
        const edge=Math.abs(c.x-platform.left)<Math.abs(c.x-platform.right)?platform.left+5:platform.right-5;
        c.departure={surface:target.s.id,x:target.x};c.goal={x:edge,surface:platform.id};state(c,'walking',12);return;
      }
      c.goal={x:target.x,surface:target.s.id};c.jump=target.jump;c.facing=target.x>=c.x?1:-1;c.vx=0;state(c,'anticipating',.28);return;
    }
    const pick=Math.random();
    if(pick<(1-c.personality.energy)*.4&&c.lastAction!=='sitting'){c.sitAfterWalk=true;c.goal={x:Math.random()<.5?platform.left+9:platform.right-9,surface:platform.id};state(c,'walking',8);}
    else if(pick<(1-c.personality.energy)*.5&&behavior.rareEvents){c.vx=0;c.goal=null;state(c,'looking',2.5);}
    else if(pick<.4){c.vx=0;c.goal=null;state(c,'looking',2);}
    else {c.goal={x:platform.left+12+Math.random()*Math.max(1,platform.right-platform.left-24),surface:platform.id};state(c,Math.random()<c.personality.playfulness*.3?'running':'walking',3+Math.random()*5);}
    c.lastAction=c.state;
  }
  function step(c:Character,dt:number){

    if(c===held)return;
    c.timer-=dt;c.cooldown-=dt;
    const pointerSpeed=performance.now()-cursor.lastMoved>200?0:cursor.speed;
    const cursorDistance=Math.hypot(cursor.x-c.x,cursor.y-(c.y-35));
    const focused=c.focus&&c.focus.until>time?characters.find(b=>b.id===c.focus?.id):undefined;
    const noticesCursor=!focused&&behavior.cursorAwareness&&cursor.active&&cursorDistance<180&&visible(c);
    if(noticesCursor){
      c.cursorNotice=(c.cursorNotice??0)+dt;
      c.attention={x:cursor.x,y:cursor.y};
    }else{
      c.cursorNotice=0;
      const friend=focused??characters.find(b=>b.id===c.chase?.id||b.id===c.flee?.id);
      c.attention=friend?{x:friend.x,y:friend.y-40}:c.goal?{x:c.goal.x,y:environment.surfaces.find(s=>s.id===c.goal?.surface)?.top??c.y-40}:undefined;
    }
    orientCharacter(c);
    if(c.intent){
      c.intent.remaining-=dt;c.vx*=Math.exp(-dt*10);
      const support=environment.surfaces.find(s=>s.id===c.platform);
      if(support)c.x=clamp(c.x+c.vx*dt,support.left+5,support.right-5);
      if(c.intent.remaining<=0){const intent=c.intent;c.intent=undefined;c.state=intent.state;c.timer=intent.duration;}
      else return;
    }
    const platform=environment.surfaces.find(s=>s.id===c.platform);
    if(c.state==='stepping'&&c.stepFrom){
      const from=c.stepFrom,t=clamp(1-c.timer/.48,0,1),ease=t*t*(3-2*t);
      if(!environment.surfaces.some(s=>s.id===from.surface)){c.stepFrom=undefined;c.grounded=false;state(c,'falling');return;}
      c.x=from.x+(from.targetX-from.x)*ease;c.y=from.y+(from.targetY-from.y)*ease;
      if(Math.abs(from.targetX-from.x)>2)c.facing=Math.sign(from.targetX-from.x);
      c.attention={x:from.targetX,y:from.targetY};
      if(t>=1){c.platform=from.surface;c.grounded=true;c.stepFrom=undefined;state(c,'looking',.4);}
      return;
    }
    if(c.state==='tapping'){
      c.vx*=Math.exp(-dt*12);
      const partner=characters.find(b=>b.id===c.tagTarget);
      if(partner&&c.timer<.4&&!c.tagContact&&partner.grounded&&partner.platform===c.platform&&Math.abs(c.x-partner.x)<32){
        c.tagContact=true;partner.intent=undefined;partner.goal=null;
        partner.attention={x:c.x,y:c.y-35};partner.facing=c.x>partner.x?1:-1;
        state(partner,'recoiling',.42);
      }
      if(c.timer<=0){
        c.tagTarget=undefined;state(c,'looking',.55);
        if(partner&&partner.grounded&&partner.platform===c.platform&&platform&&(c.tagRounds??0)<2){
          partner.tagRounds=(c.tagRounds??0)+1;partner.cooldown=1.5;
          // After the contact and reaction, swap who is "it".
          partner.chase={id:c.id,until:time+7};c.flee={id:partner.id,until:time+7};
          const direction=c.x<partner.x?-1:1;
          c.goal={x:direction<0?platform.left+14:platform.right-14,surface:platform.id};
          state(c,'running',3);
        }
      }
      return;
    }
    if(c.state==='recoiling'){c.vx=0;if(c.timer<=0)state(c,(c.fearUntil??0)>time?'running':'looking',(c.fearUntil??0)>time?2:.35);return;}
    if(c.chase&&c.chase.until<=time)c.chase=undefined;
    if(c.flee&&c.flee.until<=time)c.flee=undefined;
    const quarry=c.chase?characters.find(b=>b.id===c.chase?.id):undefined;
    if(quarry&&c.cooldown<=0&&c.grounded&&quarry.grounded&&c.platform===quarry.platform&&platform&&!['anticipating','landing','waving'].includes(c.state)){
      const distance=Math.abs(c.x-quarry.x);
      if(distance<20){
        c.chase=undefined;quarry.flee=undefined;c.vx*=.4;quarry.vx*=.4;
        c.attention={x:quarry.x,y:quarry.y-32};quarry.attention={x:c.x,y:c.y-32};
        c.focus={id:quarry.id,until:time+1.5};quarry.focus={id:c.id,until:time+1.5};
        c.goal=quarry.goal=null;c.intent=quarry.intent=undefined;c.vx=quarry.vx=0;
        c.facing=quarry.x>c.x?1:-1;quarry.facing=-c.facing;
        c.tagTarget=quarry.id;c.tagContact=false;state(c,'tapping',.7);state(quarry,'looking',.8);
        c.socialAt=quarry.socialAt=time+8;c.cooldown=quarry.cooldown=3;
      }else{c.goal={x:clamp(quarry.x,platform.left+12,platform.right-12),surface:platform.id};state(c,'running',2);}
    }else if(quarry&&c.grounded&&['looking','idle','sitting'].includes(c.state))c.timer=Math.min(c.timer,.3);
    if(!c.departure&&noticesCursor&&(c.cursorNotice??0)>.3&&c.grounded&&!c.intent&&c.cooldown<=0&&cursorDistance<130){
      c.facing=cursor.x>=c.x?1:-1;
      if(platform&&cursorDistance<85&&(pointerSpeed>350||Math.random()<(1-c.personality.bravery)*.6)){
        // A flinch/crouch reads before the retreat instead of an instantaneous launch.
        c.chase=c.flee=undefined;c.fearUntil=time+3;c.socialAt=time+5;
        const away=c.x<cursor.x?-1:1;
        c.goal={x:away<0?platform.left+12:platform.right-12,surface:platform.id};
        state(c,'recoiling',.28);
      }else if(pointerSpeed<90){
        if(platform&&cursorDistance>45&&cursor.x>platform.left+12&&cursor.x<platform.right-12){
          c.goal={x:clamp(cursor.x-c.facing*25,platform.left+10,platform.right-10),surface:platform.id};
          state(c,'walking',2);
        }else{
          c.goal=null;c.vx=0;
          state(c,cursorDistance<40?'reaching':'waving',1.3);
        }
      }
      c.cooldown=2.5+Math.random()*2;
    }
    if(c.state==='hanging'){
      c.vx=c.vy=0;
      if(c.timer<=0)state(c,'climbing',.9);
      return;
    }
    if(c.state==='climbing'){
      if(!platform){c.platform=null;c.grounded=false;state(c,'falling');return;}
      const from=c.climbFrom??{x:c.x,y:platform.top+34,duration:.9};c.climbFrom=from;
      const progress=clamp(1-c.timer/from.duration,0,1);
      const edge=from.edge??(Math.abs(from.x-platform.left)<Math.abs(from.x-platform.right)?platform.left:platform.right);
      from.edge=edge;
      const side=edge===platform.left?-1:1;
      c.facing=-side;
      const smooth=(v:number)=>{const t=clamp(v,0,1);return t*t*(3-2*t);};
      // Approach the real wall, climb with alternating contacts, then pull over its lip.
      const mantle=smooth((progress-.78)/.22);
      const approach=smooth(progress/.12);
      c.x=from.x+(edge+side*10-from.x)*approach;
      c.x+=(edge-side*12-c.x)*mantle;
      c.y=from.y+(platform.top+30-from.y)*smooth(progress/.78);
      c.y+=(platform.top-c.y)*mantle;
      c.phase+=dt*5;c.vx=c.vy=0;
      if(progress>=1){if(platform.section!==c.lastSection){c.sectionSince=time;c.destination=undefined;}c.climbFrom=undefined;c.grounded=true;state(c,'landing',.28);}
      return;
    }
    if(c.state==='anticipating'){
      if(c.timer<=0&&c.jump){if(c.jump.vy>=0)c.ignoreSurface=c.platform??undefined;c.vx=c.jump.vx;c.vy=c.jump.vy;c.platform=null;c.grounded=false;state(c,c.jump.vy>=0?'falling':'jumping',2);}
      else {if(!c.jump)state(c,'looking',.1);return;}
    }
    if(c.grounded){
      if(c.state==='walking'||c.state==='running'){
        const delta=(c.goal?.x??c.x)-c.x;
        if(Math.abs(delta)>2)c.facing=delta>0?1:-1;
        const speed=c.state==='running'?physics.runSpeed:physics.walkSpeed*(.6+c.personality.energy*.5);
        const desired=c.facing*Math.min(speed,Math.sqrt(2*150*Math.abs(delta)));
        c.vx+=(desired-c.vx)*(1-Math.exp(-dt*7));
        if(c.departure&&Math.abs(delta)<6){
          const target=environment.surfaces.find(s=>s.id===c.departure?.surface);
          const jump=target?planJump(c.x,c.y,c.departure.x,target.top,physics.gravity,c.personality.bravery,c.jumpStyle):null;
          if(jump){c.ignoreSurface=c.platform??undefined;c.goal={x:c.departure.x,surface:target!.id};c.jump=jump;c.departure=undefined;c.vx=0;state(c,'anticipating',.2);return;}
          c.departure=undefined;
        }
        if(Math.abs(delta)<5||c.timer<=0 || (platform&&(c.x<platform.left+7||c.x>platform.right-7))){c.vx*=.45;if(c.sitAfterWalk){c.sitAfterWalk=false;state(c,'sitting',2+Math.random()*3);}else state(c,'looking',.55+Math.random()*.4);}
      } else {c.vx*=Math.exp(-dt*14);if(c.timer<=0)choose(c);}
    }
    if(['climbing','anticipating'].includes(c.state))return;
    const wasGrounded=c.grounded,oldY=c.y;
    const impactSpeed=c.vy;
    moveCharacter(c,dt,environment.surfaces.filter(s=>s.label!=='nav'&&s.id!==c.ignoreSurface),environment.width,environment.floor,physics.gravity);
    orientCharacter(c);
    c.phase+=dt*(c.grounded?Math.abs(c.vx)*.15+.5:2);
    if(c.grounded&&!wasGrounded){c.impact=Math.max(0,impactSpeed);c.ignoreSurface=undefined;c.departure=undefined;c.vx*=.3;c.jump=null;state(c,'landing',.25+Math.min(.25,(c.impact??0)/2000));}
    else if(!c.grounded&&c.vy>0){
      state(c,'falling',1);
      if(behavior.climbing&&c.cooldown<=0){
        const ledge=environment.surfaces.find(s=>s.solid&&Math.min(Math.abs(c.x-s.left),Math.abs(c.x-s.right))<10&&oldY-28<=s.top&&c.y-34>=s.top-8);
        if(ledge){c.platform=ledge.id;c.x=clamp(c.x,ledge.left+2,ledge.right-2);c.y=ledge.top+34;c.vx=c.vy=0;state(c,'hanging',.7);c.cooldown=3;}
      }
    }
  }
  function social(){
    if(!behavior.socialInteractions)return;
    // Each character has its own social clock; pairs are not selected by array order.
    for(const a of [...characters].sort(()=>Math.random()-.5)){
      if(a.intent||!['idle','looking','sitting'].includes(a.state)||(a.fearUntil??0)>time||['stepping','landing','tapping','recoiling'].includes(a.state)||!visible(a)||a.chase||a.flee||!a.grounded||time<(a.socialAt??0)||a.state==='anticipating')continue;
      a.socialAt=time+5+Math.random()*12/(.4+a.personality.sociability);
      const friends=characters.filter(b=>b!==a&&b.platform===a.platform&&['idle','looking','sitting'].includes(b.state)&&(b.fearUntil??0)<=time&&visible(b)&&!b.intent&&!['stepping','landing','tapping','recoiling'].includes(b.state)&&!b.chase&&!b.flee&&b.grounded&&b.state!=='anticipating'&&Math.abs(b.y-a.y)<180&&Math.abs(b.x-a.x)<280);
      const b=friends[Math.floor(Math.random()*friends.length)];
      if(!b)continue;
      a.focus={id:b.id,until:time+3};b.focus={id:a.id,until:time+3};
      a.attention={x:b.x,y:b.y-35};b.attention={x:a.x,y:a.y-35};a.facing=b.x>a.x?1:-1;b.facing=-a.facing;
      const surface=environment.surfaces.find(s=>s.id===a.platform);
      const distance=Math.abs(a.x-b.x);
      if(a.platform===b.platform&&surface&&distance>65&&surface.right-surface.left>180&&Math.random()<.45){
        a.departure=b.departure=undefined;
        a.tagRounds=b.tagRounds=0;
        a.chase={id:b.id,until:time+12+Math.random()*10};b.flee={id:a.id,until:a.chase.until};
        a.destination=b.platform??undefined;
        if(a.grounded){a.goal=null;a.vx=0;state(a,'waving',.9);a.cooldown=1.1;}
        if(b.grounded&&surface&&a.platform===b.platform){
          const direction=b.x>=a.x?1:-1;
          b.goal={x:direction>0?surface.right-14:surface.left+14,surface:surface.id};
          state(b,'running',3);
        }else if(b.grounded)state(b,'looking',.3);
      }else if(a.platform===b.platform&&surface&&distance>65){
        a.goal={x:clamp(b.x-a.facing*34,surface.left+14,surface.right-14),surface:surface.id};
        state(a,a.personality.energy>.6?'running':'walking',4);
        state(b,'waving',1+Math.random());
      }else{
        a.goal=b.goal=null;a.vx=b.vx=0;
        state(a,distance<35?'reaching':'waving',1.2+Math.random());
        state(b,distance<35?'reaching':'waving',1.5+Math.random());if(b.intent)b.intent.remaining+=.45;
      }
      a.cooldown=a.chase?1.1:4;b.cooldown=4;b.socialAt=time+6+Math.random()*10;
      break;
    }
  }
  function render(){
    ctx!.setTransform(dpr,0,0,dpr,0,0);ctx!.clearRect(0,0,innerWidth,innerHeight);
    ctx!.save();ctx!.translate(-scrollX,-scrollY);
    if(debug)drawDebug(ctx!,characters,environment.surfaces,physics.gravity);
    const nav=environment.surfaces.find(s=>s.label==='nav');
    for(const c of characters)if(visible(c)){
      ctx!.save();
      if(nav && c.platform!==nav.id){ctx!.beginPath();ctx!.rect(scrollX,nav.bottom,innerWidth,innerHeight);ctx!.clip();}
      drawCharacter(ctx!,c,cursor,time,environment.surfaces.find(s=>s.id===c.platform));ctx!.restore();
    }
    ctx!.restore();
    config.onCharacters?.(characters.map(c=>({id:c.id,x:c.x-scrollX,y:c.y-scrollY,state:c.state})));
    canvas.dataset.states=characters.map(c=>c.state).join(',');
  }
  function tick(now:number){
    if(destroyed)return;
    if(document.hidden){last=0;return;}
    if(environment.dirty&&now-lastScan>120){const old=environment.surfaces;environment.scan();characters.forEach(c=>rideSurface(c,old,environment.surfaces));lastScan=now;}
    const dt=last?Math.min((now-last)/1000,.035):0;last=now;
    if(!paused&&!reduced.matches){time+=dt;characters.forEach(c=>step(c,dt));if(time>nextEvent){social();nextEvent=time+.8+Math.random()*1.2;}}
    if(!paused && !reduced.matches || now-lastPaint>125){render();lastPaint=now;}
    frame=requestAnimationFrame(tick);
  }
  const pointer=(event:PointerEvent)=>{
    if(event.pointerType==='touch')return;
    const now=performance.now(),x=event.clientX+scrollX,y=event.clientY+scrollY;
    cursor.speed=cursor.active?Math.hypot(x-cursor.x,y-cursor.y)/Math.max(.008,(now-cursor.lastMoved)/1000):0;
    cursor.x=x;cursor.y=y;cursor.active=true;cursor.lastMoved=now;
  };
  const leave=()=>{cursor.active=false;};
  const visibility=()=>{cancelAnimationFrame(frame);last=0;if(!document.hidden)frame=requestAnimationFrame(tick);};
  resize();spawn();frame=requestAnimationFrame(tick);
  window.addEventListener('resize',resize);window.addEventListener('pointermove',pointer,{passive:true});document.addEventListener('pointerleave',leave);document.addEventListener('visibilitychange',visibility);
  const grab=(id:number,x:number,y:number)=>{
    const c=characters.find(item=>item.id===id);if(!c)return;
    held=c;grabOffset={x:c.x-(x+scrollX),y:c.y-(y+scrollY)};lastDrag=performance.now();
    c.intent=undefined;c.departure=undefined;c.climbFrom=undefined;c.chase=c.flee=undefined;c.sitAfterWalk=false;c.jump=null;c.ignoreSurface=undefined;
    c.platform=null;c.grounded=false;c.vx=c.vy=0;c.state='held';render();
  };
  const drag=(x:number,y:number)=>{
    if(!held)return;const now=performance.now(),dt=Math.max(.016,(now-lastDrag)/1000);
    const nextX=clamp(x+scrollX+grabOffset.x,12,environment.width-12),nextY=clamp(y+scrollY+grabOffset.y,48,environment.floor);
    held.vx=clamp((nextX-held.x)/dt,-450,450);held.vy=clamp((nextY-held.y)/dt,-500,500);held.x=nextX;held.y=nextY;
    held.attention={x:x+scrollX,y:y+scrollY};lastDrag=now;render();
  };
  const release=()=>{if(!held)return;const c=held;held=undefined;if(performance.now()-lastDrag>100)c.vx=c.vy=0;c.state='falling';orientCharacter(c);c.cooldown=2;c.sectionSince=time;render();};
  const greet=(id:number)=>{const c=characters.find(item=>item.id===id);if(c?.grounded){c.goal=null;state(c,'waving',2);c.cooldown=3;}};
  return {grab,drag,release,greet,setPaused(value:boolean){paused=value;},setDebug(value:boolean){debug=value;},destroy(){destroyed=true;cancelAnimationFrame(frame);environment.destroy();window.removeEventListener('resize',resize);window.removeEventListener('pointermove',pointer);document.removeEventListener('pointerleave',leave);document.removeEventListener('visibilitychange',visibility);ctx.clearRect(0,0,canvas.width,canvas.height);}};
}
