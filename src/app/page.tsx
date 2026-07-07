import InvolvementList from '../components/InvolvementList';
import PhotoMap from '../components/PhotoMap';
import ProjectsGrid from '../components/ProjectsGrid';
import SiteFooter from '../components/SiteFooter';
import SiteNav from '../components/SiteNav';
import ThoughtsList from '../components/ThoughtsList';
import WorkList from '../components/WorkList';
import { involvement, photos, profile, projects, workEntries } from '../data/resume';
import { getAllThoughts } from '../lib/thoughts';

export default function HomePage() {
  return (
    <main className="container-page">
      <SiteNav />

      <header className="mt-16 md:mt-24">
        <h1 className="text-4xl md:text-5xl leading-tight">{profile.name}</h1>
        <p className="eyebrow mt-3">Engineering &amp; AI/ML · {profile.location}</p>
      </header>

      <section className="mt-14 space-y-5 text-[19px] leading-8 text-neutral-700">
        <p>{profile.summary}</p>
        <p>
          You can view my{' '}
          <a href="/Jeremy_Sedillo_Resume.pdf" className="body-link">
            resume
          </a>{' '}
          or{' '}
          <a href={`mailto:${profile.email}`} className="body-link">
            say hello
          </a>
          .
        </p>
      </section>

      <div className="mt-16">
        <WorkList items={workEntries} />
      </div>

      <div className="mt-16">
        <InvolvementList items={involvement} />
      </div>

      <div className="mt-16">
        <ThoughtsList items={getAllThoughts()} />
      </div>

      <div className="mt-16">
        <ProjectsGrid items={projects} />
      </div>

      <div id="photo-map" className="mt-16">
        <PhotoMap items={photos} />
      </div>

      <SiteFooter socials={profile.socials} email={profile.email} />
    </main>
  );
}
