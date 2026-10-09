import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
const names=process.argv.slice(2).length?process.argv.slice(2):['fccw-crm','raiseachild','climate-cents','tally'];
function run(args){const p=spawnSync('ffmpeg',['-hide_banner','-loglevel','error','-y',...args],{stdio:'inherit'});if(p.status)throw new Error('FFmpeg failed');}
for(const name of names){
 const base=`work/product-demos/source/${name}-capture.mp4`,frames=`work/product-demos/captures/${name}`;
 if(fs.existsSync(`${frames}/0000.jpg`))run(['-framerate','10','-i',`${frames}/%04d.jpg`,'-c:v','libx264','-crf','16','-pix_fmt','yuv420p',base]);
 if(!fs.existsSync(base))throw new Error(`Missing captured source: ${base}`);
 run(['-ss','1','-i',base,'-frames:v','1',`public/demos/${name}.jpg`]);
 // Keep the entire application frame; interpolate the captured interaction to 30fps.
 run(['-i',base,'-an','-vf','minterpolate=fps=30:mi_mode=mci,scale=1920:1080:flags=lanczos,setsar=1','-c:v','libx264','-preset','fast','-crf','21','-pix_fmt','yuv420p','-movflags','+faststart',`public/demos/${name}.mp4`]);
 console.log(`Rendered real interface: ${name}`);
}
