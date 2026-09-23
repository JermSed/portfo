import Link from 'next/link';
import HeroTerrain from '../components/HeroTerrain';
import Image from 'next/image';
import InvolvementList from '../components/InvolvementList';
import ProjectsGrid from '../components/ProjectsGrid';
import ThoughtsList from '../components/ThoughtsList';
import WorkList from '../components/WorkList';
import { involvement, profile, projects, workEntries } from '../data/resume';
import { getAllThoughts } from '../lib/thoughts';

export default function HomePage() {
  return <>
    <header className="home-hero">
      <div className="hero-topline"><span className="eyebrow">Engineer, builder &amp; observer</span><span className="eyebrow">San Francisco, CA</span></div>
      <div className="hero-composition">
        <div className="hero-copy"><h1>Jeremy<br /><span>Sedillo.</span></h1><p className="hero-intro">Thoughtful software.<br />A curious eye.</p></div>
        <HeroTerrain />
      </div>
      <div className="hero-bottom"><p>I build reliable software and clear interfaces, with a focus on AI-enabled products. Studying Computer Engineering &amp; Computer Science at USC.</p><a className="round-link" href="#projects" aria-label="Explore selected projects">↓</a></div>
    </header>
    <section className="currently"><span className="eyebrow"><span className="status-dot" />On my desk</span><p>SceneFlow <span>— a collaborative canvas for filmmakers.</span></p><a href="#projects" aria-label="Read about SceneFlow">↗</a></section>
    <div className="page-section" id="projects"><ProjectsGrid items={projects} /></div>
    <div className="career-grid page-section"><WorkList items={workEntries} /><div><InvolvementList items={involvement} /><div className="resume-note"><span className="eyebrow">The longer version</span><a href="/Jeremy_Sedillo_Resume.pdf" className="body-link">View my résumé ↗</a></div></div></div>
    <section className="field-section page-section" aria-labelledby="field-heading"><div className="section-heading"><div><p className="eyebrow">03 / Away from the keyboard</p><h2 id="field-heading">Looking a little closer.</h2></div><Link href="/photos" className="text-link">Photo journal ↗</Link></div><div className="field-grid"><Link href="/photos" className="field-photo"><Image src="/photos/yosemite-jan-2026.jpg" alt="Jeremy sitting on a cliff in Yosemite, looking out across the valley" width={1333} height={2000} sizes="(max-width: 700px) 100vw, 65vw" /><span>Yosemite, California <span>↗</span></span></Link><div className="field-copy"><svg className="field-sketch" viewBox="0 0 200 112" fill="none" aria-hidden="true">
        <circle cx="150" cy="25" r="11" />
        <path d="M10 91 64 27 103 75 128 47 190 91M47 47l17-20 19 23-15-5-8 9-5-10M112 65l16-18 19 14M10 98h180" />
        <path className="field-sketch-faint" d="m64 27-8 49 18-13-5 28m59-44-6 32 12-7m-42 32c-5-7 23-8 12-15s-17-5-12-12" />
      </svg><p>Hiking, photography,<br />and time outside.</p><p className="field-description">I like exploring new places on foot and bringing a camera along. Here are a few moments from those trips.</p><Link href="/photos#photo-map" className="body-link">Places I’ve been ↗</Link></div></div></section>
    <div className="page-section journal-section"><ThoughtsList items={getAllThoughts()} /></div>
    <section className="contact-section"><p className="eyebrow">Have something in mind?</p><a href={`mailto:${profile.email}`}>Let’s make it happen.<span>↗</span></a></section>
  </>;
}
