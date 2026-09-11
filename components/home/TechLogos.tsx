const technologies = ["Next.js", "TypeScript", "MongoDB", "Tailwind CSS", "React", "Node.js"];

export default function TechLogos() {
  return (
    <section className="border-y border-white/8 bg-zinc-950/80" aria-label="Technologies used by DevPulse">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-4 px-5 py-7 text-sm font-semibold tracking-wide text-zinc-500 sm:gap-x-12 sm:px-8">
        {technologies.map((technology) => (
          <span key={technology} className="transition-colors hover:text-emerald-300">
            {technology}
          </span>
        ))}
      </div>
    </section>
  );
}
