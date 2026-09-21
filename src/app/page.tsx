import Link from 'next/link';
import Image from 'next/image';
import InvolvementList from '../components/InvolvementList';
import ProjectsGrid from '../components/ProjectsGrid';
import ThoughtsList from '../components/ThoughtsList';
import WorkList from '../components/WorkList';
import { involvement, profile, projects, workEntries } from '../data/resume';
import { getAllThoughts } from '../lib/thoughts';

function Contours() {
  return <div className="contour-art" aria-hidden="true">
    <svg viewBox="0 0 500 500" fill="none">
      {Array.from({ length: 23 }, (_, i) => <ellipse key={i} cx="250" cy="250" rx={35 + i * 8} ry={55 + i * 7} transform={`rotate(${i * 3 - 35} 250 250)`} />)}
      <path d="M250 20v460M20 250h460" className="contour-axis" />
      <circle cx="250" cy="250" r="5" className="contour-point" />
    </svg>
  </div>;
}

export default function HomePage() {
  return <>
    <header className="home-hero">
      <div className="hero-topline"><span className="eyebrow">Engineer, builder &amp; observer</span><span className="eyebrow">San Francisco, CA</span></div>
      <div className="hero-composition">
        <div className="hero-copy"><h1>Jeremy<br /><span>Sedillo.</span></h1><p className="hero-intro">Thoughtful software.<br />A curious eye.</p></div>
        <Contours />
      </div>
      <div className="hero-bottom"><p>I build reliable software and clear interfaces, with a focus on AI-enabled products. Studying Computer Engineering &amp; Computer Science at USC.</p><a className="round-link" href="#projects" aria-label="Explore selected projects">↓</a></div>
    </header>
    <section className="currently"><span className="eyebrow"><span className="status-dot" />On my desk</span><p>SceneFlow <span>— a collaborative canvas for filmmakers.</span></p><a href="#projects" aria-label="Read about SceneFlow">↗</a></section>
    <div className="page-section" id="projects"><ProjectsGrid items={projects} /></div>
    <div className="career-grid page-section"><WorkList items={workEntries} /><div><InvolvementList items={involvement} /><div className="resume-note"><span className="eyebrow">The longer version</span><a href="/Jeremy_Sedillo_Resume.pdf" className="body-link">View my résumé ↗</a></div></div></div>
    <section className="field-section page-section" aria-labelledby="field-heading"><div className="section-heading"><div><p className="eyebrow">03 / Away from the keyboard</p><h2 id="field-heading">Looking a little closer.</h2></div><Link href="/photos" className="text-link">Photo journal ↗</Link></div><div className="field-grid"><Link href="/photos" className="field-photo"><Image src="/photos/yosemite-cliff.jpg" alt="A view across the granite cliffs of Yosemite" width={1200} height={800} sizes="(max-width: 700px) 100vw, 65vw" /><span>Yosemite, California <span>↗</span></span></Link><div className="field-copy"><span className="field-asterisk" aria-hidden="true">✳</span><p>Good things happen<br />when I take the long way.</p><p className="field-description">Outside of software, you’ll usually find me hiking, making photographs, or looking for the next place to explore.</p><Link href="/photos#photo-map" className="body-link">Places I’ve been ↗</Link></div></div></section>
    <div className="page-section journal-section"><ThoughtsList items={getAllThoughts()} /></div>
    <section className="contact-section"><p className="eyebrow">Have something in mind?</p><a href={`mailto:${profile.email}`}>Let’s make it happen.<span>↗</span></a></section>
  </>;
}
