import { projectStories, type ProjectSlug } from '../data/project-stories';

const decisions: Record<ProjectSlug, { title: string; copy: string }[]> = {
  buckit: [
    { title: 'A floating panel', copy: 'The panel stays above other apps and opens with Option + Space. Files can be dragged into the form or document underneath.' },
    { title: 'Organizing files', copy: 'Spaces group files and links by task. Search finds items within a collection; drag and drop moves files between Buckit and other apps.' },
  ],
  sceneflow: [
    { title: 'Shot order', copy: 'The agent uses the storyboard’s shot descriptions and order to find footage and arrange the timeline.' },
    { title: 'Missing footage', copy: 'Shots with missing or low-confidence matches stay marked as unshot so the filmmaker can review them.' },
    { title: 'Resolve output', copy: 'The timeline keeps video and audio linked. Filmmakers can replace clips and continue editing in Resolve.' },
  ],
  'fccw-crm': [
    { title: 'Sync reliability', copy: 'Shopify webhooks deliver updates as they happen. Scheduled reconciliation checks for missed updates and repairs differences between Shopify and the CRM.' },
    { title: 'Backend', copy: 'Cloudflare Workers, Hono, D1, and TypeScript handle memberships, donations, and events in the same backend.' },
  ],
  delphi: [
    { title: 'Speech to actions', copy: 'Gemini interprets the request and connects it to elements on the current webpage. The Web Speech API handles voice input.' },
    { title: 'Feedback and testing', copy: 'Narration tells the user what the assistant found and what it did. I tested the path from voice input to page interaction on live websites. Delphi remains a hackathon prototype.' },
  ],
  tally: [
    { title: 'Product variants', copy: 'Each product variant has its own material quantities and stock levels, so reorders reflect the materials that variant consumes.' },
    { title: 'Reordering', copy: 'Low-stock thresholds trigger alerts and reordering workflows. Dashboards show current inventory and replenishment needs.' },
  ],
  'climate-cents': [
    { title: 'Map navigation', copy: 'Visitors can search for a project or filter by type and completion status. Selecting a project opens its location and details.' },
    { title: 'Data layers', copy: 'Heat, air-quality, and ozone are separate layers so visitors can inspect one dataset at a time.' },
  ],
  raiseachild: [
    { title: 'Saved filters', copy: 'Staff can save filters for status, process step, and preferred language, then reuse them for recurring reports.' },
    { title: 'Reporting', copy: 'The dashboard uses the Little Green Light API, PostgreSQL, Express, React, and Node. Charts compare constituent and event data by year and region.' },
  ],
};

export default function ProjectCaseStudy({ slug }: { slug: ProjectSlug }) {
  const story = projectStories[slug];
  return <section className="project-case-study" aria-label={`${story.name} case study`}>
    <div className="case-study-row"><h2>Problem</h2><p>{story.problem}</p></div>
    <div className="case-study-row"><h2>What I built</h2><p>{story.built}</p></div>
    <div className="case-study-row"><h2>Decisions</h2><div className="case-study-decisions">{decisions[slug].map(decision => <section key={decision.title}><h3>{decision.title}</h3><p>{decision.copy}</p></section>)}</div></div>
    <div className="case-study-row"><h2>Result</h2><p>{story.result}</p></div>
  </section>;
}
