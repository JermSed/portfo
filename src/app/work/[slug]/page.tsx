import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProjectDrawing from '../../../components/ProjectDrawing';
import SceneFlowPreview from '../../../components/SceneFlowPreview';
import { projectStories, type ProjectSlug } from '../../../data/project-stories';
import { projectLandings } from '../../../data/project-landings';
import { projects } from '../../../data/resume';
export function generateStaticParams(){return Object.keys(projectLandings).map(slug=>({slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const story=projectStories[slug as ProjectSlug];return {title:story?.name??'Project'};}
export default async function ProjectPage({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;
  if(!Object.hasOwn(projectLandings,slug))notFound();
  const story=projectStories[slug as ProjectSlug];
  const product=projectLandings[slug as keyof typeof projectLandings];
  const project=projects.find(p=>p.name===story.name)!;
  return <article className="product-landing">
    <Link href="/#projects" className="text-link">← Selected work</Link>
    <header className="product-hero">
      <p className="eyebrow">{story.name}</p>
      <h1>{story.headline}</h1>
      <p className="product-intro">{product.intro}</p>
      <a className="product-cta" href={project.url ?? '#product-preview'}>{project.url ? (slug==='delphi'?'Explore the source':'Visit '+story.name) : (slug==='sceneflow'?'See it in action':'Explore '+story.name)} <span aria-hidden="true">↗</span></a>
    </header>
    <div id="product-preview" className={`product-preview${slug==='sceneflow'?' product-preview-video':''}`}>
      {slug==='sceneflow'?<SceneFlowPreview hero/>:<ProjectDrawing name={story.name}/>}
    </div>
    <section className="product-benefits" aria-labelledby="benefits-heading">
      <h2 id="benefits-heading">{product.heading}</h2>
      <div>{product.benefits.map(([title,copy])=><section key={title}><h3>{title}</h3><p>{copy}</p></section>)}</div>
    </section>
    <section className="product-proof"><p>{product.proof}</p><span>{product.status}</span></section>
    <footer className="product-bottom"><span>{project.tech.join(' · ')}</span><Link href="/#projects" className="text-link">Explore more projects ↗</Link></footer>
  </article>;
}
