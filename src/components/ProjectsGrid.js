import Link from 'next/link';
import ProjectDrawing from './ProjectDrawing';
import { projectStories } from '../data/project-stories';
import Image from 'next/image';

export default function ProjectsGrid({ items }) {
  if (!items?.length) return null;
  return <section aria-labelledby="projects-heading" className="selected-work">
    <div className="section-heading"><div><p className="eyebrow">01 / Selected work</p><h2 id="projects-heading">Projects</h2></div><span className="eyebrow">A closer look at what I build</span></div>
    <div className="portfolio-projects">{items.map((project,i)=>{
      const entry=Object.entries(projectStories).find(([,story])=>story.name===project.name);
      if(!entry)return null;
      const [slug,story]=entry;
      return <article key={slug} className="portfolio-project project-card">
        <Link href={`/work/${slug}`} className="project-case-link" aria-label={`${project.name} — read case study`}>
          <div className={`project-cover project-card-${i}`}>{slug==='buckit'?<Image src="/buckit/buckit-job-search.jpg" alt="Buckit floating over a job application email with a resume, portfolio, and job description ready" width={1280} height={720} className="buckit-card-image"/>:<ProjectDrawing name={project.name}/>}<span className="cover-caption">{slug==='buckit'?'Buckit for macOS':'Concept / workflow'}</span></div>
          <div className="project-summary"><div className="project-title-row"><h3>{project.name}</h3><span aria-hidden="true">↗</span></div><p className="project-subtitle">{story.headline}</p><p>{project.description}</p><ul className="project-tags" aria-label="Technologies">{project.tech.map(tech=><li key={tech}>{tech}</li>)}</ul><span className="case-study-label">Read case study <span aria-hidden="true">→</span></span></div>
        </Link>
      </article>;
    })}</div>
  </section>;
}
