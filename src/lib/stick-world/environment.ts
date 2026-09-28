import type { Surface } from './types';
// Only painted card edges and divider lines are physical scenery.
const SELECTOR='.project-cover, .entry-row, .work-first-hero, .site-nav, main h1, main h2, main h3, .entry-row img, .scene-diagram span, .project-drawing rect';
export class DOMEnvironment {
  surfaces:Surface[]=[];
  width=0; floor=0; dirty=true;
  private ids=new WeakMap<Element,number>();
  private serial=0;
  private textIds=new WeakMap<Element,number[]>();
  private observed=new Set<Element>();
  private resize=new ResizeObserver(()=>{this.dirty=true;});
  private mutations=new MutationObserver(records=>{
    if(records.some(r=>!(r.target instanceof Element && r.target.closest('[data-stick-ignore],.block-playground')))) this.dirty=true;
  });
  constructor() {
    this.resize.observe(document.documentElement);
    this.mutations.observe(document.body,{childList:true,subtree:true});
    window.addEventListener('scroll',this.invalidate,{passive:true});
    window.addEventListener('resize',this.invalidate,{passive:true});
    document.addEventListener('load',this.invalidate,true);
    document.addEventListener('toggle',this.invalidate,true);
  }
  invalidate=()=>{this.dirty=true;};
  scan() {
    this.dirty=false;
    const sx=window.scrollX,sy=window.scrollY;
    const modal=document.querySelector<HTMLElement>('dialog[open], [role="dialog"][aria-modal="true"]');
    const nodes=Array.from((modal||document).querySelectorAll<HTMLElement>(SELECTOR)).filter(el=>!el.closest('[data-stick-ignore], [hidden]')).slice(0,100);
    const next:Surface[]=[];
    const measure=document.createElement('canvas').getContext('2d');
    for(const el of nodes) {
      const rect=el.getBoundingClientRect();
      if(rect.width<24 || rect.height<8 || el.getClientRects().length===0) continue;
      if(!this.ids.has(el))this.ids.set(el,++this.serial);
      if(!this.observed.has(el)){this.resize.observe(el);this.observed.add(el);}
      const nav=el.matches('.site-nav');
      const bottomEdge=nav||el.matches('.work-first-hero');
      const style=getComputedStyle(el);
      if(style.visibility==='hidden'||style.display==='none'||Number(style.opacity)===0)continue;
      const section=el.closest('section, .page-section');
      const sectionKey=section?.getAttribute('aria-labelledby')||section?.id||section?.className||'intro';
      if(el.matches('h1,h2,h3')){
        // Measure individual visible words, never the full block-width heading box.
        const ids=this.textIds.get(el)??[];this.textIds.set(el,ids);
        const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);
        let node:Node|null,index=0;
        while((node=walker.nextNode())){
          const text=node.textContent??'';
          for(const match of text.matchAll(/\S+/g)){
            const range=document.createRange();range.setStart(node,match.index!);range.setEnd(node,match.index!+match[0].length);
            const bounds=range.getBoundingClientRect();
            if(bounds.width<24)continue;
            const font=getComputedStyle(node.parentElement??el);
            if(measure)measure.font=font.font||font.fontSize+' '+font.fontFamily;
            const metrics=measure?.measureText(match[0]);
            const ascent=metrics?.fontBoundingBoxAscent??bounds.height*.8;
            const descent=metrics?.fontBoundingBoxDescent??bounds.height*.2;
            const baseline=bounds.top+(bounds.height-ascent-descent)/2+ascent;
            const inkTop=baseline-(metrics?.actualBoundingBoxAscent??ascent);
            const inkBottom=baseline+(metrics?.actualBoundingBoxDescent??descent);
            ids[index]??=++this.serial;
            next.push({id:ids[index++],left:bounds.left+sx,right:bounds.right+sx,top:inkTop+sy,bottom:inkBottom+sy,solid:false,section:sectionKey,label:'word'});
          }
        }
        continue;
      }
      next.push({id:this.ids.get(el)!,left:rect.left+sx,right:rect.right+sx,top:(bottomEdge?rect.bottom:rect.top)+sy,bottom:rect.bottom+sy,solid:el.matches('.project-cover, img, .scene-diagram span, rect'),section:sectionKey,label:nav?'nav':el.getAttribute('aria-label')||el.tagName.toLowerCase()});
    }
    for(const el of this.observed)if(!el.isConnected){this.resize.unobserve(el);this.observed.delete(el);}
    this.surfaces=next;
    this.width=document.documentElement.clientWidth;
    this.floor=Math.max(document.documentElement.scrollHeight,window.innerHeight)-12;
    return next;
  }
  destroy(){this.resize.disconnect();this.mutations.disconnect();window.removeEventListener('scroll',this.invalidate);window.removeEventListener('resize',this.invalidate);document.removeEventListener('load',this.invalidate,true);document.removeEventListener('toggle',this.invalidate,true);}
}
