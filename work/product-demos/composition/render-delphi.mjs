import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import sharp from 'sharp';
const root='work/product-demos';
fs.mkdirSync(`${root}/previews`,{recursive:true});
function run(args){const p=spawnSync('ffmpeg',['-hide_banner','-loglevel','error','-y',...args],{stdio:'inherit'});if(p.status)throw new Error('FFmpeg failed');}
// Two moments from the original LA Hacks demonstration. No invented browser UI.
for(const [name,start,duration] of [['voice',48,12],['browser',68,24]]) {
 const path=`${root}/source/delphi-${name}.mp4`;
 if(!fs.existsSync(path))run(['-ss',String(start),'-i',`${root}/source/delphi-original.mp4`,'-t',String(duration),'-an','-c:v','libx264','-crf','18',path]);
}
const labels=`<svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="1920" height="92" fill="#141619"/><rect x="958" y="0" width="4" height="1080" fill="#141619"/><g font-family="Helvetica, Arial" fill="#ffffff" font-size="28"><text x="40" y="57">Voice interface</text><text x="1000" y="57">Browser agent</text></g><text x="1875" y="57" text-anchor="end" font-family="Helvetica, Arial" font-size="20" fill="#a4aeba">Original LA Hacks demo · 2×</text></svg>`;
fs.writeFileSync(`${root}/composition/delphi-labels.svg`,labels);
await sharp(Buffer.from(labels)).png().toFile(`${root}/previews/delphi-labels.png`);
run(['-i',`${root}/source/delphi-voice.mp4`,'-i',`${root}/source/delphi-browser.mp4`,'-i',`${root}/previews/delphi-labels.png`,'-filter_complex','[0:v]crop=608:684:0:170,scale=960:1080,setsar=1,setpts=PTS-STARTPTS,fps=30[l];[1:v]crop=608:684:0:170,scale=960:1080,setsar=1,setpts=(PTS-STARTPTS)/2,fps=30[r];[l][r]hstack[film];[film][2:v]overlay=0:0[out]','-map','[out]','-t','12','-an','-c:v','libx264','-crf','22','-preset','fast','-pix_fmt','yuv420p','-movflags','+faststart','public/demos/delphi.mp4']);
run(['-ss','6','-i','public/demos/delphi.mp4','-frames:v','1','public/demos/delphi.jpg']);
