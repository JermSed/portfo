import React from 'react';
import './App.css';
import Header from './components/Header';
import WorkList from './components/WorkList';
import ProjectsGrid from './components/ProjectsGrid';
import Intro from './components/Intro';
import PhotoGallery from './components/PhotoGallery';
import StampPlayground from './components/StampPlayground';
import { profile, workEntries, projects, photos } from './data/resume';

function App() {
  return (
    <div className="site-bg relative overflow-hidden">
      <div className="gradient-blob gradient-blob-1" />
      <div className="gradient-blob gradient-blob-2" />
      <main className="container-page space-y-8 md:space-y-12 relative">
        <div className="card p-7 md:p-10 hero-card shadow-subtle">
          <Header
            name={profile.name}
            tagline={profile.tagline}
            location={profile.location}
            socials={profile.socials}
          />
          <div className="mt-6 space-y-6">
            <Intro summary={profile.summary} email={profile.email} />
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="stat-pill">
                <span className="text-sm text-slate-500">Focus</span>
                <span className="text-base font-semibold text-ink-900">AI / ML products</span>
              </div>
              <div className="stat-pill">
                <span className="text-sm text-slate-500">Currently</span>
                <span className="text-base font-semibold text-ink-900">USC · CSCI/CE</span>
              </div>
              <div className="stat-pill">
                <span className="text-sm text-slate-500">Works well with</span>
                <span className="text-base font-semibold text-ink-900">Design systems</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="card p-6 md:p-8 shadow-subtle">
            <WorkList items={workEntries} />
          </div>
          <div className="card p-6 md:p-8 shadow-subtle">
            <ProjectsGrid items={projects} />
          </div>
        </div>

        <div className="card p-6 md:p-8 shadow-subtle">
          <PhotoGallery items={photos} />
        </div>

        <div className="card p-6 md:p-8 shadow-subtle">
          <StampPlayground />
        </div>
      </main>
    </div>
  );
}

export default App;
