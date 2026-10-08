import fs from 'node:fs/promises';
import sharp from 'sharp';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
const root=new URL('../',import.meta.url), base=new URL('../../../',import.meta.url);
// Cropped source frames from the user's Loom demo; no desktop or account chrome.
await fs.mkdir(new URL('previews/',root),{recursive:true});
await fs.mkdir(new URL('public/sceneflow/',base),{recursive:true});
const asset=async name=>`data:image/png;base64,${(await fs.readFile(new URL(`source/${name}.png`,root))).toString('base64')}`;
const shots=await Promise.all(Array.from({length:6},(_,i)=>asset(`shot-${i}`)));
const footage=await Promise.all(Array.from({length:4},(_,i)=>asset(`footage-${i}`)));
const timeline=await asset('resolve-timeline');
const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>{x=clamp(x);return x*x*(3-2*x)},p=(t,a,b)=>ease((t-a)/(b-a)),mix=(a,b,t)=>a+(b-a)*t;
const tx=(x,y,s,z=28,c='#f4f4f5',w=400)=>`<text x="${x}" y="${y}" font-family="Helvetica,Arial,sans-serif" font-size="${z}" fill="${c}" font-weight="${w}" letter-spacing="${z>50?'-2':'0'}">${s}</text>`;
const r=(x,y,w,h,c='#202125',rad=12,stroke='none')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rad}" fill="${c}" stroke="${stroke}"/>`;
const im=(src,x,y,w,h,fit="slice")=>`<image href="${src}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid ${fit}"/>`;
const g=(opacity,content,transform='')=>`<g opacity="${clamp(opacity)}" transform="${transform}">${content}</g>`;
const labels=['Wide · The table','Close-up · Roll the dice','Insert · Longest road','Close-up · Settlement','Wide · Reactions','Over shoulder · Cards'];
function frame(time){
 const t=3+time*1.65;
 const enter=p(t,0,2),focus=p(t,5.5,7.5)*(1-p(t,13,15)),morph=p(t,13.5,15.7),native=p(t,15.3,16.3),end=0;
 let s='';
 let app=r(100,264,1720,690,'#f4f4f6',20)+r(100,264,1720,70,'#fafafa',20)+r(100,305,1720,29,'#fafafa',0)+tx(140,309,'SceneFlow',25,'#191a1e',600)+tx(360,309,'Catan night',24,'#73747c')+`<path d="M100 334H1820M512 334V858" stroke="#d9d9df"/>`+tx(140,386,'FOOTAGE',20,'#777880',600)+tx(554,386,'STORYBOARD',20,'#777880',600);
 for(let i=0;i<4;i++){
 const x=140+i%2*172,y=418+Math.floor(i/2)*201,appear=p(t,.25+i*.13,1.1+i*.13);
 app+=g(appear,r(x,y,152,177,'#fff',8)+im(footage[i],x,y,152,129)+tx(x+12,y+158,`C0${417+i}.MP4`,18,'#55565d'),`translate(0 ${24*(1-appear)})`);
 }
 for(let i=0;i<6;i++){
 const x=554+i%3*406,y=418+Math.floor(i/3)*211,appear=p(t,.8+i*.13,1.7+i*.13),matched=i<4?p(t,9.5+i*.55,10.1+i*.55):0;
 let card=r(x,y,374,190,'#fff',9,matched>0?'#7b96ec':'#dedee4')+g(1-matched,im(shots[i],x+52,y+8,268,132))+g(matched,im(footage[i%4],x+12,y+8,350,132))+tx(x+18,y+171,`${String(i+1).padStart(2,'0')}   ${labels[i]}`,18,'#494a52');
 if(matched)card+=g(matched,r(x+333,y+15,26,26,'#416bea',13)+tx(x+339,y+34,'✓',18,'#fff'));
 app+=g(appear,card,`translate(0 ${30*(1-appear)})`);
 }
 const press=p(t,8.1,8.2)*(1-p(t,8.2,8.4)),working=p(t,8.3,8.5),done=p(t,12.5,12.8);
 app+=r(100,858,1720,96,'#fafafa',20)+r(100,858,1720,22,'#fafafa',0)+`<path d="M100 858H1820" stroke="#dedee4"/>`;
 app+=g(1-working,tx(140,916,'Google Drive · 5 clips',23,'#73747c'));
 app+=g(working*(1-done),tx(140,916,'Matching footage to your storyboard…',23,'#73747c'));
 app+=g(done,tx(140,916,'4 shots matched · Ready in Resolve',23,'#73747c'));
 app+=g(1,r(1500,879,278,54,working?'#e5e9f2':'#416bea',10)+tx(1550,915,done?'Cut ready':working?'Making cut…':'Make cut',24,working?'#4564ad':'#fff',500),`translate(1639 906) scale(${1-.03*press}) translate(-1639 -906)`);
 app+=g(working,`<path d="M101 859H${101+1718*p(t,8.4,12.6)}" stroke="#416bea" stroke-width="3"/>`);
 const move=p(t,6.9,8),cx=mix(1290,1694,move),cy=mix(729,910,move);
 app+=g(p(t,6.6,6.9)*(1-p(t,8.6,9)),`<path d="M0 0v38l10-12 11 18 8-5-11-18 16-2Z" fill="#17181d" stroke="white" stroke-width="2"/>`,`translate(${cx} ${cy})`);
 s+=g((1-p(t,13.5,13.85))*(1-end),app,`translate(960 620) scale(${1+.035*focus}) translate(-960 -620)`);
 // A continuous rearrangement carries the four matched images into timeline positions.
 let transition=r(100,264,1720,690,'#1d1e22',20)+tx(140,314,'DaVinci Resolve',25,'#d8d8dd')+tx(420,314,'Catan night — SceneFlow Cut',24,'#9899a4');
 for(let i=0;i<4;i++){
 const x=mix(554+i%3*406,300+i*330,morph),y=mix(418+Math.floor(i/3)*211,485,morph),w=mix(374,324,morph),h=mix(190,220,morph);
 transition+=im(footage[i],x,y,w,h)+r(x,y+h+8,w,66,'#25845e',4);
 for(let j=0;j<45;j++){const height=8+Math.abs(Math.sin(j*1.9+i))*34;transition+=`<path d="M${x+6+j*(w-12)/45} ${y+h+41-height/2}v${height}" stroke="#bec6d3" stroke-width="2"/>`;}
 }
 s+=g(p(t,13.5,13.85)*(1-native)*(1-end),transition);
 const push=1+.025*p(t,16.5,20.5);
 s+=g(native*(1-end),r(100,264,1720,690,'#1d1e22',20)+tx(140,314,'DaVinci Resolve',25,'#d8d8dd')+tx(420,314,'Catan night — SceneFlow Cut',24,'#9899a4')+g(1,im(timeline,155,350,1610,580,"meet"),`translate(960 640) scale(${push}) translate(-960 -640)`));
 let canvas=r(0,0,1920,1080,`rgb(${[244,244,246].map((v,i)=>Math.round(mix(v,[29,30,34][i],p(t,13.5,13.85)))).join(',')})`,0)+g(1,s,'translate(-96 -167) scale(1.1)');
 if(time>11.55)canvas+=g(p(time,11.55,12),frame(0));
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080">${canvas}</svg>`;
}
const test=process.argv.includes('--test'),start=test?3:0,duration=test?6:12;
const out=test?new URL('previews/motion-test.mp4',root).pathname:new URL('public/sceneflow/sceneflow-demo.mp4',base).pathname;
const ff=spawn('ffmpeg',['-y','-hide_banner','-loglevel','error','-f','image2pipe','-vcodec','mjpeg','-framerate','30','-i','-','-an','-c:v','libx264','-preset','fast','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart',out],{stdio:['pipe','inherit','inherit']});
const finished=once(ff,'close');ff.stdin.on('error',()=>{});
for(let n=0;n<duration*30;n++){
 const svg=frame(start+n/30),buf=await sharp(Buffer.from(svg)).jpeg({quality:94}).toBuffer();
 if(!ff.stdin.write(buf))await once(ff.stdin,'drain');
 if(n%120===0)console.log(`Rendered ${n}/${duration*30}`);
}
ff.stdin.end();const [code]=await finished;if(code!==0)throw new Error(`ffmpeg exit ${code}`);
if(!test){await sharp(Buffer.from(frame(0))).jpeg({quality:92}).toFile(new URL('public/sceneflow/sceneflow-poster.jpg',base).pathname);for(const t of [0,3,5,7,9,11])await sharp(Buffer.from(frame(t))).resize(960,540).png().toFile(new URL(`previews/motion-${t}.png`,root).pathname);}
console.log(out);
