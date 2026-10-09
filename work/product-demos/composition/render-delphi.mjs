import sharp from 'sharp';
import fs from 'node:fs/promises';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
// Recreated example: actual Delphi radial voice UI + a captured Wikipedia page.
// Caption dialogue and activity are illustrative, not a recording of a live agent run.
const root='work/product-demos';
await fs.mkdir(`${root}/previews`,{recursive:true});
const page=(await fs.readFile(`${root}/source/delphi-wikipedia.jpg`)).toString('base64');
const ease=(t,a,b)=>{const x=Math.max(0,Math.min(1,(t-a)/(b-a)));return x*x*(3-2*x)};
const text=(x,y,s,size=28,color='#111827',anchor='middle')=>`<text x="${x}" y="${y}" font-family="Arial,Helvetica,sans-serif" font-size="${size}" fill="${color}" text-anchor="${anchor}">${s}</text>`;
const rect=(x,y,w,h,color,r=0)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${color}"/>`;
const mic=(x,y,scale,color,off=false)=>`<g transform="translate(${x} ${y}) scale(${scale})" fill="none" stroke="${color}" stroke-width="1.7" stroke-linecap="round"><rect x="-3" y="-9" width="6" height="12" rx="3"/><path d="M-6 0v1a6 6 0 0 0 12 0V0M0 7v4M-3 11h6"/>${off?'<path d="M-9 -9L9 11"/>':''}</g>`;
function frame(t){
 const reset=ease(t,13,14),split=ease(t,3.4,4.5)*(1-reset),cx=960-655*split,cy=525;
 const active=t>.7&&t<12.2,speaking=t>=4.2&&t<5.6||t>=7&&t<11.9;
 const volume=active?(speaking?23: t<3.8?32:3):0;
 let s=`<defs><linearGradient id="bg" x2="0" y2="1"><stop stop-color="#eef2ff"/><stop offset="1" stop-color="#fff"/></linearGradient><clipPath id="web"><rect x="610" y="128" width="1270" height="796" rx="0"/></clipPath></defs>`;
 s+=rect(0,0,1920,1080,'url(#bg)');
 s+=`<g opacity="${split}" transform="translate(${80*(1-split)} 0)">`+rect(608,70,1274,858,'#d9dce5',14)+rect(610,72,1270,852,'white',12)+rect(610,72,1270,56,'#f4f5f8',12);
 s+='<circle cx="636" cy="100" r="6" fill="#c6cad2"/><circle cx="658" cy="100" r="6" fill="#c6cad2"/><circle cx="680" cy="100" r="6" fill="#c6cad2"/>';
 s+=rect(792,84,851,32,'#e9ecf1',6)+text(1217,106,t<5?'en.wikipedia.org':'en.wikipedia.org/wiki/Screen_reader',18,'#556070');
 const load=ease(t,5.0,5.3),scroll=70*ease(t,6.3,7.1);
 s+=`<g clip-path="url(#web)" opacity="${load}"><image href="data:image/jpeg;base64,${page}" x="610" y="${128-scroll}" width="1270" height="893"/></g>`;
 if(t>4.2&&t<5.3)s+=rect(610,126,1270*ease(t,4.2,5.3),3,'#6366f1');
 s+='</g>';
 s+=mic(cx-112,316,2.2,'#111827')+text(cx+20,334,'Delphi',60);
 for(let i=0;i<50;i++){const a=i/50*Math.PI*2,inner=50,outer=100+volume*(.3+.7*Math.pow(Math.sin(i*2.71+t*9),2));s+=`<line x1="${cx+Math.cos(a)*inner}" y1="${cy+Math.sin(a)*inner}" x2="${cx+Math.cos(a)*outer}" y2="${cy+Math.sin(a)*outer}" stroke="#6366f1" opacity=".7" stroke-width="2"/>`;}
 s+=mic(cx,cy,1.4,active?'#b91c1c':'#6366f1',active);
 s+=text(cx,713,!active?(t<1?'tap to activate':'ready'):speaking?'delphi is speaking':t<3.8?'listening...':'ready',21,'#242938');
 if(t<1.35){const f=ease(t,0,.65),x=1100-140*f,y=650-120*f;s+=`<g opacity="${1-ease(t,1,1.35)}" transform="translate(${x} ${y})"><path d="M0 0L0 28L8 21L15 35L21 31L14 18L26 18Z" fill="#242938" stroke="white" stroke-width="2"/></g>`;}
 let who='',lines=[];
 if(t>=.9&&t<4.1){who='YOU';lines=['Open Wikipedia and explain','what a screen reader does.'];}
 else if(t>=4.2&&t<6){who='DELPHI';lines=['I’ll open the article.'];}
 else if(t>=7&&t<12.3){who='DELPHI';lines=['A screen reader turns on-screen information','into speech or braille.'];}
 if(lines.length){const h=lines.length===2?130:92,y=1034-h;s+=rect(390,y,1140,h,'#181b25',16)+text(960,y+29,who,16,'#bfc5ee')+lines.map((l,i)=>text(960,y+67+i*38,l,30,'#fff')).join('');}
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080">${s}</svg>`;
}
const ff=spawn('ffmpeg',['-hide_banner','-loglevel','error','-y','-f','image2pipe','-vcodec','mjpeg','-framerate','30','-i','-','-an','-c:v','libx264','-preset','fast','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart','public/demos/delphi.mp4']);
const done=once(ff,'close');ff.stderr.on('data',d=>process.stderr.write(d));
for(let i=0;i<420;i++){
 const jpg=await sharp(Buffer.from(frame(i/30))).jpeg({quality:92}).toBuffer();
 if(i===240)await fs.writeFile('public/demos/delphi.jpg',jpg);
 if([30,90,150,240,330].includes(i))await fs.writeFile(`${root}/previews/delphi-recreated-${i}.jpg`,jpg);
 if(!ff.stdin.write(jpg))await once(ff.stdin,'drain');
}
ff.stdin.end();if((await done)[0])throw Error('Render failed');
