import InvolvementList from '../components/InvolvementList';
import ProjectsGrid from '../components/ProjectsGrid';
import ThoughtsList from '../components/ThoughtsList';
import WorkList from '../components/WorkList';
import { involvement, profile, projects, workEntries } from '../data/resume';
import { getAllThoughts } from '../lib/thoughts';

export default function HomePage() {
  return <>
    <header className="work-first-hero">
      <div className="hero-topline"><span className="eyebrow">Software engineer</span><span className="eyebrow">San Francisco, CA</span></div>
      <h1>Jeremy <span>Sedillo.</span></h1>
      <div className="work-first-intro"><p>Building AI tools, creative software,<br />and systems people rely on.</p><a className="round-link" href="#projects" aria-label="Explore selected work">↓</a></div>
      <div className="personal-intro"><p>I’m a Computer Engineering and Computer Science student at USC. I build software that brings together clear interfaces and reliable systems—from tools for filmmakers to platforms that help nonprofits serve their communities.</p><p>I’ve spent three summers as a software engineering intern at Amazon, co-founded Tally, and led development with Code The Change. I’m currently building SceneFlow, a filmmaking platform that connects collaborative storyboarding with AI-assisted editing.</p><p>Outside of software, I’m usually hiking, exploring somewhere new, or bringing a camera along. That curiosity carries into the things I build.</p></div>
      <p className="hero-credentials">Amazon internships ×3 <span>·</span> USC Computer Engineering &amp; CS <span>·</span> LavaLab</p>
    </header>
    <div className="page-section" id="projects"><ProjectsGrid items={projects} /></div>
    <div className="career-grid page-section"><WorkList items={[{...workEntries[0],role:"Software Development Engineer Intern ×3",period:"2024–26"},...workEntries.filter(job=>job.name!=="Amazon")]} /><div><InvolvementList items={involvement} /><div className="resume-note"><span className="eyebrow">The longer version</span><a href="/Jeremy_Sedillo_Resume.pdf" className="body-link">View my résumé ↗</a></div></div></div>
    <div className="page-section journal-section"><ThoughtsList items={getAllThoughts()} /></div>
    <section className="contact-section"><p className="eyebrow">Have something in mind?</p><a href={`mailto:${profile.email}`}>Let’s make it happen.<span>↗</span></a></section>
  </>;
}
