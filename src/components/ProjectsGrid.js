import Link from 'next/link';
import ProjectDemo from './ProjectDemo';
import { projectStories } from '../data/project-stories';

export default function ProjectsGrid({ items }) {
  if (!items?.length) return null;
  return <section aria-labelledby="projects-heading" className="selected-work">
    <div className="section-heading"><div><p className="eyebrow">01 / Selected work</p><h2 id="projects-heading">Projects</h2></div><span className="eyebrow">A closer look at what I build</span></div>
    <div className="portfolio-projects">{items.map((project,i)=>{
      const entry=Object.entries(projectStories).find(([,story])=>story.name===project.name);
      if(!entry)return null;
      const [slug,story]=entry;
      return <article key={slug} className="portfolio-project project-card">
        <Link href={`/work/${slug}`} className="project-case-link" aria-label={`${project.name}: view project`}>
          <div className={`project-cover project-card-${i}`}><ProjectDemo slug={slug}/></div>
          <div className="project-summary"><div className="project-title-row"><h3>{project.name}</h3><span aria-hidden="true">↗</span></div><p className="project-subtitle">{story.headline}</p><span className="case-study-label">View project <span aria-hidden="true">→</span></span></div>
        </Link>
      </article>;
    })}</div>
  </section>;
}
