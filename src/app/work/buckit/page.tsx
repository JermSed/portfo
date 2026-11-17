import Link from 'next/link';
import type { Metadata } from 'next';
import ProjectCaseStudy from '../../../components/ProjectCaseStudy';
import BuckitPreview from '../../../components/BuckitPreview';

const download = '/buckit/Buckit-0.1.1-macos-arm64.dmg';

export const metadata: Metadata = {
  title: 'Buckit for Mac',
  description: 'A floating panel for files and links on macOS.',
};

export default function BuckitPage() {
  return (
    <article className="product-landing buckit-landing">
      <Link href="/#projects" className="text-link">← Projects</Link>
      <header className="product-hero">
        <p className="eyebrow">Mac utility · 2026</p>
        <h1>Buckit</h1>
      </header>
      <div className="product-preview product-preview-video"><BuckitPreview hero /></div>
      <section className="product-overview">
        <p className="product-intro">A floating panel for files and links. Open it with <kbd>⌥ Space</kbd>, search your items, and drag files into another app.</p>
        <div>
          <a className="product-cta" href={download} download>Download for Mac <span aria-hidden="true">↓</span></a>
          <p className="buckit-requirements">Version 0.1.1 · macOS 14+ · Apple Silicon</p>
        </div>
      </section>
      <ProjectCaseStudy slug="buckit" />
      <section className="project-install" aria-labelledby="install-heading">
        <h2 id="install-heading">Installation</h2>
        <p>Open the DMG and drag Buckit into Applications. Launch the app, then press <kbd>⌥ Space</kbd> to open the panel.</p>
        <p className="project-demo-note">Developer ID signed and Apple notarized.</p>
      </section>
      <footer className="product-bottom"><Link href="/#projects" className="text-link">All projects ↗</Link></footer>
    </article>
  );
}
