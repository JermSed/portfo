import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProjectCaseStudy from '../../../components/ProjectCaseStudy';
import ProjectDemo from '../../../components/ProjectDemo';
import { projectStories, type ProjectSlug } from '../../../data/project-stories';
import { projectLandings, projectLinks } from '../../../data/project-landings';
import { projects } from '../../../data/resume';
export function generateStaticParams(){return Object.keys(projectLandings).map(slug=>({slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const story=projectStories[slug as ProjectSlug];return {title:story?.name??'Project'};}
export default async function ProjectPage({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;
  if(!Object.hasOwn(projectLandings,slug))notFound();
  const story=projectStories[slug as ProjectSlug];
  const product=projectLandings[slug as keyof typeof projectLandings];
  const project=projects.find(p=>p.name===story.name)!;
  const destination=projectLinks[slug] ?? (project.url ? {url:project.url,label:'Visit '+story.name} : null);
  return <article className="product-landing">
    <Link href="/#projects" className="text-link">← Projects</Link>
    <header className="product-hero">
      <p className="eyebrow">{story.category}</p>
      <h1>{story.name}</h1>
    </header>
    <div id="product-preview" className="product-preview product-preview-video">
      <ProjectDemo slug={slug} hero />
    </div>
    <section className="product-overview">
      <p className="product-intro">{product.intro}</p>
      {destination && <a className="product-cta" href={destination.url}>{destination.label} <span aria-hidden="true">↗</span></a>}
    </section>
    <p className="project-demo-note">{product.status}</p>
    <ProjectCaseStudy slug={slug as ProjectSlug} />
    <footer className="product-bottom"><span>{project.tech.join(' · ')}</span><Link href="/#projects" className="text-link">All projects ↗</Link></footer>
  </article>;
}
