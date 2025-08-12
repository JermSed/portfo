import React from 'react';
import './App.css';
import Header from './components/Header';
import WorkList from './components/WorkList';
import ProjectsGrid from './components/ProjectsGrid';
import Intro from './components/Intro';
import { profile, workEntries, projects } from './data/resume';

function App() {
  return (
    <div className="site-bg">
      <Header name={profile.name} socials={profile.socials} />
      <div className="container-page pt-28">
        <div className="card p-6 md:p-10">
          <Intro summary={profile.summary} email={profile.email} />
          <WorkList items={workEntries} />
          <ProjectsGrid items={projects} />
          {/* Writing section removed per request */}
        </div>
      </div>
    </div>
  );
}

export default App;
