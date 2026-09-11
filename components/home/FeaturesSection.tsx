import { ArrowRight, Flame, FolderKanban } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Flame,
    eyebrow: "See the rhythm",
    title: "Contribution heatmaps",
    description: "Turn scattered commits into a living picture of your momentum. Spot patterns, celebrate consistency, and keep the streak alive.",
    action: "Open your activity",
    accent: "emerald",
  },
  {
    icon: FolderKanban,
    eyebrow: "Show the work",
    title: "Project showcases",
    description: "Give every build a home with crisp descriptions, thoughtful tech tags, and a direct line to the repository behind it.",
    action: "Explore projects",
    accent: "amber",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">A clearer signal</p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-5xl">The work is already there. Make it count.</h2>
        <p className="mt-5 text-base leading-7 text-zinc-400">One focused place for the habits and projects that define how you build.</p>
      </div>
      <div className="mt-12 grid gap-5 lg:grid-cols-2">
        {features.map(({ icon: Icon, eyebrow, title, description, action, accent }) => (
          <article key={title} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_20px_50px_-30px_rgba(52,211,153,0.8)] sm:p-9">
            <div className={`absolute right-0 top-0 size-40 rounded-full blur-3xl ${accent === "emerald" ? "bg-emerald-400/10" : "bg-amber-300/8"}`} />
            <span className={`relative flex size-11 items-center justify-center rounded-lg ${accent === "emerald" ? "bg-emerald-400/12 text-emerald-300" : "bg-amber-300/12 text-amber-300"}`}>
              <Icon aria-hidden="true" size={22} />
            </span>
            <p className="relative mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{eyebrow}</p>
            <h3 className="relative mt-2 text-2xl font-semibold tracking-tight text-white">{title}</h3>
            <p className="relative mt-4 max-w-lg text-base leading-7 text-zinc-400">{description}</p>
            <Link href="/dashboard" className="relative mt-8 inline-flex items-center gap-2 text-sm font-semibold text-zinc-200 transition-colors group-hover:text-emerald-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-300">
              {action}
              <ArrowRight aria-hidden="true" size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
