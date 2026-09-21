import ProjectDrawing from './ProjectDrawing';

const tones = ['cobalt', 'ochre'];
const labels = ['In progress / Film & software', 'Community / Technical leadership', '1st place / LA Hacks 2025', 'Startup / Small business', 'Environment / Data visualization', 'Community / Reporting tools'];
export default function ProjectsGrid({ items }) {
  if (!items?.length) return null;
  return <section aria-labelledby="projects-heading">
    <div className="section-heading"><div><p className="eyebrow">01 / Selected work</p><h2 id="projects-heading">Ideas into useful things.</h2></div><span className="eyebrow">{String(items.length).padStart(2, '0')} projects</span></div>
    <div className="project-grid">{items.map((project, i) => <article key={project.name} className={`project-card project-card-${i} ${tones[i] ? `tone-${tones[i]}` : 'project-card-neutral'}`}>
      <div className="project-top"><span className="eyebrow">{labels[i]}</span><span className="project-number">0{i + 1}</span></div>
      <ProjectDrawing name={project.name} />
      <h3>{project.url ? <a href={project.url}>{project.name}<span aria-hidden="true">↗</span></a> : project.name}</h3>
      <p>{project.description}</p><div className="project-tech">{project.tech.join(' / ')}</div>
    </article>)}</div>
  </section>;
}
