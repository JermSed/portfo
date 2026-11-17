import Link from 'next/link';
import InvolvementList from '../components/InvolvementList';
import ProjectsGrid from '../components/ProjectsGrid';
import ThoughtsList from '../components/ThoughtsList';
import WorkList from '../components/WorkList';
import { involvement, profile, projects, workEntries } from '../data/resume';
import { getAllThoughts } from '../lib/thoughts';

export default function HomePage() {
  return <div className="personal-home">
    <header className="personal-header">
      <h1>Jeremy Sedillo</h1>
      <p>Software engineer · Computer Engineering &amp; CS at USC</p>
      <span>San Francisco, CA</span>
    </header>
    <section className="personal-bio" aria-label="About Jeremy">
      <p>I’m studying Computer Engineering and Computer Science at USC. I’ve spent three summers as a software engineering intern at Amazon, co-founded Tally, and led development with Code The Change.</p>
      <p>Currently, I’m building <Link href="/work/sceneflow" className="body-link">SceneFlow</Link>, a storyboarding app that matches footage to shots and assembles a DaVinci Resolve timeline. I also made <Link href="/work/buckit" className="body-link">Buckit</Link>, a floating file and link panel for Mac.</p>
      <p>Outside of software, I enjoy hiking and <Link href="/photos" className="body-link">photography</Link>.</p>
    </section>
    <div className="page-section" id="projects"><ProjectsGrid items={projects} /></div>
    <div className="career-grid page-section"><WorkList items={[{...workEntries[0],role:"Software Development Engineer Intern ×3",period:"2024–26"},...workEntries.filter(job=>job.name!=="Amazon")]} /><InvolvementList items={involvement} /></div>
    <div className="page-section journal-section"><ThoughtsList items={getAllThoughts()} /></div>
    <section className="contact-section"><p className="eyebrow">Contact</p><a href={`mailto:${profile.email}`}>Email me<span>↗</span></a></section>
  </div>;
}
