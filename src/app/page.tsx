import Link from "next/link";

const experience = [
  {
    company: "Amazon",
    role: "Software Development Engineer Intern",
    period: "May 2025 - Aug 2025",
    highlight:
      "Built an order delay detection pipeline that improved fulfillment efficiency by 25% and removed 20+ manual hours per week.",
  },
  {
    company: "Amazon",
    role: "Software Development Engineer Intern",
    period: "May 2024 - Aug 2024",
    highlight:
      "Shipped a dynamic messaging API for Amazon Fresh that reduced checkout latency by 22%.",
  },
  {
    company: "Tally",
    role: "Technical Co-Founder",
    period: "Sep 2024 - May 2025",
    highlight:
      "Built inventory and analytics tooling that improved client workflows by 40% and supported $120K+ in added revenue.",
  },
];

const projects = [
  {
    name: "FCCW CRM",
    year: "2025",
    highlight: "Led engineering for a CRM serving 3K+ members and reduced manual corrections by 80%.",
  },
  {
    name: "Delphi",
    year: "LA Hacks 2025",
    highlight: "Built a voice-driven browsing tool with Gemini + React and won 1st place in healthcare.",
  },
  {
    name: "Climate Cents",
    year: "2024",
    highlight: "Created a platform mapping LA climate projects with live sustainability and donation data.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-white text-zinc-900">
      <main className="mx-auto w-full max-w-3xl px-6 py-10 sm:px-8 sm:py-14">
        <header className="mb-10 flex items-center justify-between border-b border-zinc-200 pb-5">
          <div>
            <p className="text-sm font-semibold tracking-tight">Jeremy Sedillo</p>
            <p className="mt-1 text-xs text-zinc-500">Software Engineer</p>
          </div>
          <Link href="/visitors" className="text-sm text-zinc-600 hover:text-zinc-900">
            Visitors
          </Link>
        </header>

        <section className="mb-10">
          <h1 className="text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
            Experience
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-600">
            USC Computer Engineering + Computer Science student focused on backend systems
            and full-stack products with measurable impact.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              "jjsedill@usc.edu",
              "github.com/Jermsed",
              "linkedin.com/in/jeremy-sedillo",
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs text-zinc-700"
              >
                {item}
              </span>
            ))}
          </div>
        </section>

        <section id="experience" className="mb-10">
          <div className="space-y-4">
            {experience.map((job) => (
              <article
                key={`${job.company}-${job.period}`}
                className="rounded-lg border border-zinc-200 bg-zinc-50/40 p-4"
              >
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-sm font-semibold">
                    {job.role} · {job.company}
                  </h2>
                  <p className="text-xs text-zinc-500 uppercase">{job.period}</p>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-zinc-700">{job.highlight}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="projects">
          <h2 className="text-sm font-semibold tracking-tight">Projects</h2>
          <div className="mt-4 space-y-3">
            {projects.map((project) => (
              <article key={project.name} className="rounded-lg border border-zinc-200 bg-zinc-50/40 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold">{project.name}</h3>
                  <span className="text-xs text-zinc-500 uppercase">{project.year}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-zinc-700">{project.highlight}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
