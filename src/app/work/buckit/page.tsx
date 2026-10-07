import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

const download = '/buckit/Buckit-0.1.1-macos-arm64.dmg';

export const metadata: Metadata = {
  title: 'Buckit for Mac',
  description: 'Keep your frequently used links and files within reach in a floating macOS panel.',
};

export default function BuckitPage() {
  return <article className="case-study buckit-page">
    <Link href="/#projects" className="text-link">← Selected work</Link>
    <header className="buckit-intro">
      <p className="eyebrow">Mac utility / Buckit 0.1.1</p>
      <h1>Buckit</h1>
      <p className="case-deck">The things you reach for, one shortcut away.</p>
      <p className="buckit-lede">Keep frequently used links and files close while you work. Press <kbd>⌥ Space</kbd> to open Buckit’s floating panel, then get what you need without losing your place.</p>
      <a className="buckit-download" href={download} download>Download for Mac <span aria-hidden="true">↓</span></a>
      <p className="buckit-requirements">Version 0.1.1 · macOS 14 or later · Apple Silicon</p>
    </header>

    <figure className="buckit-visual">
      <Image src="/buckit/buckit-job-search.jpg" alt="Buckit floating beside a job application email, showing a resume PDF, portfolio link, and job description in a Job Search Space" width={1280} height={720} priority />
      <figcaption>Buckit stays at hand while you work in another app.</figcaption>
    </figure>

    <div className="case-sections">
      <section><h2 className="eyebrow">01 / In practice</h2><p>Filling out job applications? Keep several versions of your resume, your portfolio link, and the job description together in a Job Search Space. Open Buckit over the form, drag in the right resume, copy the link, and carry on.</p></section>
      <section><h2 className="eyebrow">02 / How it works</h2><div><p>Organize resources into color-coded Spaces and search to find an item quickly. Drag files into Buckit to keep them handy, or drag them out into another app. Move the panel out of the way and leave it visible as you switch apps.</p><p>Buckit starts with one empty Default Space, ready for your own files and links.</p></div></section>
      <section><h2 className="eyebrow">03 / Install</h2><div><ol className="buckit-steps"><li>Download the DMG and open it.</li><li>Drag Buckit into Applications.</li><li>Open Buckit, then press <kbd>⌥ Space</kbd> to bring up the panel.</li></ol><p className="buckit-trust">The DMG is Developer ID signed, Apple notarized, and stapled.</p></div></section>
    </div>
    <a className="buckit-download buckit-download-bottom" href={download} download>Download for Mac <span aria-hidden="true">↓</span></a>
    <Link href="/#projects" className="text-link">Back to all work ↗</Link>
  </article>;
}
