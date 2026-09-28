import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProjectDrawing from '../../../components/ProjectDrawing';
import { projectStories, type ProjectSlug } from '../../../data/project-stories';
import { projects } from '../../../data/resume';
export function generateStaticParams(){return Object.keys(projectStories).map(slug=>({slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const story=projectStories[slug as ProjectSlug];return {title:story?.name??'Project'};}
export default async function ProjectPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  if(!Object.hasOwn(projectStories,slug))notFound();
  const story=projectStories[slug as ProjectSlug];const project=projects.find(p=>p.name===story.name)!;
  return <article className="case-study">
    <Link href="/#projects" className="text-link">← Selected work</Link>
    <header><p className="eyebrow">{story.category}</p><h1>{story.name}</h1><p className="case-deck">{story.headline}</p><div className="project-tech">{project.tech.join(' · ')}</div></header>
    <div className={`case-visual project-card-${Object.keys(projectStories).indexOf(slug)}`}><ProjectDrawing name={story.name}/><p className="eyebrow">Workflow illustration</p></div>
    <div className="case-sections">{[['01 / The problem',story.problem],['02 / What I built',story.built]].map(([heading,body])=><section key={heading}><h2 className="eyebrow">{heading}</h2><p>{body}</p></section>)}
    <section><h2 className="eyebrow">03 / System overview</h2><ol className="case-flow">{story.flow.map(step=><li key={step}>{step}</li>)}</ol></section>
    <section><h2 className="eyebrow">04 / Technical focus</h2><p>{story.challenge}</p></section>
    <section><h2 className="eyebrow">05 / Outcome</h2><p>{story.result}</p>{project.url&&<a className="text-link" href={project.url}>{slug==='delphi'?'View source':'Visit project'} ↗</a>}</section></div>
    <Link className="text-link" href="/#projects">Back to all work ↗</Link>
  </article>;
}
