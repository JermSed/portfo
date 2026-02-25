import Link from "next/link";
import Image from "next/image";

const experience = [
  {
    company: "Amazon",
    role: "Software Development Engineer Intern",
    period: "May 2025 - Aug 2025",
    year: "2025",
    logo: "/images/amazonlogo.png",
    highlight:
      "Built an order delay detection pipeline that improved fulfillment efficiency by 25% and removed 20+ manual hours per week.",
  },
  {
    company: "Tally",
    role: "Technical Co-Founder",
    period: "Sep 2024 - May 2025",
    year: "2024-25",
    logo: "/images/tally.png",
    highlight:
      "Built inventory and analytics tooling that improved client workflows by 40% and supported $120K+ in added revenue.",
  },
  {
    company: "Amazon",
    role: "Software Development Engineer Intern",
    period: "May 2024 - Aug 2024",
    year: "2024",
    logo: "/images/amazonlogo.png",
    highlight:
      "Shipped a dynamic messaging API for Amazon Fresh that reduced checkout latency by 22%.",
  },
  {
    company: "CodeTheChange",
    role: "Technical Lead, VP of Events, & Developer",
    period: "Sep 2023 - Present",
    year: "2023-Present",
    logo: "/images/codethechange.jpeg",
    highlight: "Studying computer engineering and computer science at USC.",
  },
  {
    company: "USCLavaLab",
    role: "Technical Co-Founder & Mentor",
    period: "Sep 2024 - Present",
    year: "2024-Present",
    logo: "/images/lava.jpg",
    highlight: "Studying computer engineering and computer science at USC.",
  },
  {
    company: "Colorstack",
    role: "Member",
    period: "2023 - Present",
    year: "2023-Present",
    logo: "/images/colorstack.png",
    highlight: "Studying computer engineering and computer science at USC.",
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
    <main className="min-h-dvh bg-white text-zinc-900">
      <div className="mx-auto w-full max-w-2xl px-6 py-12 sm:px-8 sm:py-16">
        <header className="mb-14 flex items-start justify-between">
          <div>
            <p className="text-xl font-semibold tracking-tight text-zinc-900">Jeremy Sedillo</p>
            <p className="mt-1 text-xs text-zinc-500">software engineer</p>
          </div>
          <Link href="/visitors" className="text-sm text-zinc-500 transition hover:text-zinc-900">
            visitors
          </Link>
        </header>

        <section className="mb-14">
          <div className="max-w-xl space-y-5 text-sm leading-relaxed text-zinc-600">
            <p>
              I am an engineer focused on AI-powered products, backend systems, and
              thoughtful product design. I am currently studying computer engineering and
              computer science at USC and building software with measurable impact.
            </p>
            <p>
              I have interned at Amazon twice, where I worked on systems that improved
              fulfillment efficiency and checkout performance. I also co-founded Tally and
              built inventory and analytics tooling that helped customers operate faster.
            </p>
            <p>
              I like working at the intersection of engineering and product. Recent projects
              include leading engineering for a CRM used by 3K+ members, building an AI
              voice-browsing tool that won LA Hacks 2025 healthcare, and launching
              sustainability-focused tools through Climate Cents.
            </p>
            <p>See more on my resume, or reach out below.</p>
          </div>
          <div className="mt-5 flex flex-wrap gap-4 text-sm text-zinc-600">
            <a href="mailto:jjsedill@usc.edu" className="underline-offset-4 hover:underline">
              email
            </a>
            <a
              href="https://github.com/Jermsed"
              target="_blank"
              rel="noreferrer"
              className="underline-offset-4 hover:underline"
            >
              github
            </a>
            <a
              href="https://linkedin.com/in/jeremy-sedillo"
              target="_blank"
              rel="noreferrer"
              className="underline-offset-4 hover:underline"
            >
              linkedin
            </a>
          </div>
        </section>

        <section className="mb-14 border-t border-zinc-200 pt-8">
          <h2 className="mb-5 text-xs font-semibold tracking-[0.18em] text-zinc-500 uppercase">
            experience
          </h2>
          <div>
            {experience.map((job) => (
              <article
                key={`${job.company}-${job.period}`}
                className="flex items-center justify-between gap-4 border-b border-zinc-200 py-3 last:border-b-0"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Image
                    src={job.logo}
                    alt={`${job.company} logo`}
                    width={26}
                    height={26}
                    className="h-6 w-6 rounded-sm object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-zinc-900">{job.company}</p>
                    <p className="truncate text-xs text-zinc-500">{job.role}</p>
                  </div>
                </div>
                <p className="shrink-0 text-sm text-zinc-500">{job.year}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-zinc-200 pt-8">
          <h2 className="mb-5 text-xs font-semibold tracking-[0.18em] text-zinc-500 uppercase">
            projects
          </h2>
          <div className="space-y-3">
            {projects.map((project) => (
              <article key={project.name} className="rounded-xl border border-zinc-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-medium">{project.name}</h3>
                  <span className="text-xs text-zinc-500 uppercase">{project.year}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-zinc-700">{project.highlight}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
