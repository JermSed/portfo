import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import sharp from 'sharp';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { sameOrigin, studioAuthorized, studioEnabled, validToken } from '../../../../lib/studio-auth';

export const runtime = 'nodejs';
export async function GET(request: Request, { params }: { params: Promise<{kind:string}> }) {
  const {kind}=await params;
  const url=new URL(request.url);
  if (kind!=='unlock' || !/^127\.0\.0\.1:\d+$/.test(request.headers.get('host')||'') || !studioEnabled() || !validToken(url.searchParams.get('token')||'')) return new Response('Not found',{status:404});
  const response=NextResponse.redirect(new URL('/studio', `http://${request.headers.get('host')}`));
  response.cookies.set('portfolio-studio',process.env.STUDIO_TOKEN!,{httpOnly:true,sameSite:'strict',path:'/',maxAge:43200});
  response.headers.set('Referrer-Policy','no-referrer');
  response.headers.set('Cache-Control','no-store');
  return response;
}
export async function POST(request: Request, {params}: {params:Promise<{kind:string}>}) {
  if (!await studioAuthorized()) return NextResponse.json({error:'Open the editor using npm run studio.'},{status:404});
  if (!await sameOrigin(request)) return NextResponse.json({error:'Invalid request origin.'},{status:403});
  const {kind}=await params;
  if (!['thought','photo'].includes(kind)) return new Response('Not found',{status:404});
  const length=Number(request.headers.get('content-length'));
  if (!length || length>22*1024*1024) return NextResponse.json({error:'Please keep uploads under 20 MB.'},{status:413});
  let imagePath='';
  try {
    const form=await request.formData();
    const text=(key:string,max:number) => {
      const value=form.get(key);
      if(typeof value!=='string' || !value.trim() || value.length>max || (key!=='body' && /[\r\n]/.test(value))) throw new Error(`Please check ${key}.`);
      return value.trim();
    };
    const title=text('title',120);
    const slug=(title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,70)||'entry')+'-'+randomUUID().slice(0,8);
    if(kind==='thought') {
      const cover=text('cover',300), date=text('date',10), body=text('body',50000);
      if(!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date))) throw new Error('Choose a valid date.');
      fs.mkdirSync('content/thoughts',{recursive:true});
      fs.writeFileSync(path.join('content/thoughts',`${slug}.md`),`---\ntitle: ${title}\ndate: ${date}\ncover: ${cover}\n---\n\n${body}\n`,{flag:'wx'});
      revalidatePath('/'); revalidatePath('/thoughts');
      return NextResponse.json({message:'Saved locally. Review it, then commit and deploy when ready.',url:`/thoughts/${slug}`});
    }
    const location=text('location',120), category=text('category',20);
    if(!['city','nature','coast','night'].includes(category)) throw new Error('Choose a category.');
    const latitude=Number(text('latitude',30)), longitude=Number(text('longitude',30));
    if(!Number.isFinite(latitude)||!Number.isFinite(longitude)||Math.abs(latitude)>90||Math.abs(longitude)>180) throw new Error('Check the map coordinates.');
    const image=form.get('image');
    if(!(image instanceof File)||!image.size||image.size>20*1024*1024) throw new Error('Choose a photo under 20 MB.');
    const input=Buffer.from(await image.arrayBuffer());
    const decoder=sharp(input,{limitInputPixels:60000000});
    const metadata=await decoder.metadata();
    if(!['jpeg','png','webp'].includes(metadata.format||'')) throw new Error('Choose a JPEG, PNG, or WebP photo.');
    const output=await decoder.rotate().resize({width:2000,height:2000,fit:'inside',withoutEnlargement:true}).jpeg({quality:88,mozjpeg:true}).toBuffer();
    fs.mkdirSync('public/photos',{recursive:true});
    imagePath=path.join('public/photos',`${slug}.jpg`);
    fs.writeFileSync(imagePath,output,{flag:'wx'});
    fs.mkdirSync('content',{recursive:true});
    const file='content/photos.json';
    const photos=fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):[];
    photos.unshift({title,location,category,url:`/photos/${slug}.jpg`,coordinates:[longitude,latitude]});
    const temporary=`${file}.${randomUUID()}.tmp`;
    fs.writeFileSync(temporary,JSON.stringify(photos,null,2)+'\n'); fs.renameSync(temporary,file);
    revalidatePath('/photos');
    return NextResponse.json({message:'Photo saved locally and added to the journal and map. Commit and deploy when ready.',url:'/photos'});
  } catch(error) {
    if(imagePath && fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    return NextResponse.json({error:error instanceof Error?error.message:'Could not save. Please try again.'},{status:400});
  }
}
