import Link from 'next/link';
import type { Metadata } from 'next';
import BuckitPreview from '../../../components/BuckitPreview';

const download = '/buckit/Buckit-0.1.1-macos-arm64.dmg';

export const metadata: Metadata = {
  title: 'Buckit for Mac',
  description: 'Your everyday files and links, one shortcut away. Buckit is a floating workspace for macOS.',
};

export default function BuckitPage() {
  return <article className="product-landing buckit-landing">
    <Link href="/#projects" className="text-link">← Selected work</Link>
    <header className="product-hero">
      <p className="eyebrow">Buckit for Mac</p>
      <h1>Keep it within reach.</h1>
    </header>
    <div id="product-preview" className="product-preview product-preview-video"><BuckitPreview hero /></div>
    <section className="product-overview">
      <p className="product-intro">Your files and links, one shortcut away. Open Buckit with <kbd>⌥ Space</kbd>, find what you need, and drag it into the app you’re already using.</p>
      <div><a className="product-cta" href={download} download>Download for Mac <span aria-hidden="true">↓</span></a><p className="buckit-requirements">Buckit 0.1.1 · macOS 14+ · Apple Silicon</p></div>
    </section>

    <div className="buckit-quickline" aria-label="Buckit highlights"><span>⌥ Space to open</span><span>Color-coded Spaces</span><span>Search in a moment</span><span>Drag files in and out</span></div>

    <section className="buckit-story" aria-labelledby="buckit-story-title">
      <p className="eyebrow">A place for the things in between</p>
      <h2 id="buckit-story-title">One application.<br/>Everything at hand.</h2>
      <p>You’re filling out a job application. One role needs a design resume; another needs a technical one. Your portfolio link and the job description are in different tabs. Put them in a Job Search Space, open Buckit over the form, and drag the right file straight in.</p>
      <div className="buckit-resource-row" aria-label="Example resources"><span><b className="buckit-resource-dot buckit-purple"/>Resumes</span><span><b className="buckit-resource-dot buckit-blue"/>Portfolio link</span><span><b className="buckit-resource-dot buckit-orange"/>Job descriptions</span></div>
    </section>

    <section className="buckit-feature-grid" aria-label="How Buckit works">
      <div><p className="eyebrow">01 / Make room</p><h3>Spaces for every context.</h3><p>Group what you need in color-coded Spaces. Buckit begins with one empty Default Space, ready to make your own.</p></div>
      <div><p className="eyebrow">02 / Find it fast</p><h3>Search without switching.</h3><p>Open the floating panel with <kbd>⌥ Space</kbd>, search your items, and get back to what you were doing.</p></div>
      <div><p className="eyebrow">03 / Stay in flow</p><h3>Take it with you.</h3><p>Move the panel out of the way. It stays visible across apps while you drag files into or out of it.</p></div>
    </section>

    <section className="buckit-install" aria-labelledby="buckit-install-title">
      <div><p className="eyebrow">Ready when you are</p><h2 id="buckit-install-title">Make space for Buckit.</h2><p>Download the DMG, open it, and drag Buckit into Applications. Launch it from Applications, then press <kbd>⌥ Space</kbd>.</p><p className="buckit-trust">Developer ID signed · Apple notarized · Stapled</p></div>
      <a className="buckit-download" href={download} download>Download for Mac <span aria-hidden="true">↓</span></a>
    </section>
  </article>;
}
