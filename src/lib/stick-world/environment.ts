import type { Surface } from './types';
// Only painted card edges and divider lines are physical scenery.
const SELECTOR='.project-cover, .entry-row, .work-first-hero, .site-nav';
export class DOMEnvironment {
  surfaces:Surface[]=[];
  width=0; floor=0; dirty=true;
  private ids=new WeakMap<Element,number>();
  private serial=0;
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
    const nodes=Array.from((modal||document).querySelectorAll<HTMLElement>(SELECTOR)).filter(el=>!el.closest('[data-stick-ignore], [hidden], [aria-hidden="true"]')).slice(0,100);
    const next:Surface[]=[];
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
      next.push({id:this.ids.get(el)!,left:rect.left+sx,right:rect.right+sx,top:(bottomEdge?rect.bottom:rect.top)+sy,bottom:rect.bottom+sy,solid:el.matches('.project-cover'),section:sectionKey,label:nav?'nav':el.getAttribute('aria-label')||el.tagName.toLowerCase()});
    }
    for(const el of this.observed)if(!el.isConnected){this.resize.unobserve(el);this.observed.delete(el);}
    this.surfaces=next;
    this.width=document.documentElement.clientWidth;
    this.floor=Math.max(document.documentElement.scrollHeight,window.innerHeight)-12;
    return next;
  }
  destroy(){this.resize.disconnect();this.mutations.disconnect();window.removeEventListener('scroll',this.invalidate);window.removeEventListener('resize',this.invalidate);document.removeEventListener('load',this.invalidate,true);document.removeEventListener('toggle',this.invalidate,true);}
}
