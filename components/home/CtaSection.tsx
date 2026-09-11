import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CtaSection() {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 lg:pb-32">
      <div className="relative overflow-hidden rounded-2xl border border-emerald-300/20 bg-linear-to-br from-emerald-400/12 via-zinc-900 to-amber-300/8 px-6 py-12 sm:px-12 sm:py-16">
        <div className="relative max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">Start with today</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Your next streak starts with one project.</h2>
          <p className="mt-4 text-base leading-7 text-zinc-400">Open the dashboard, add what you are building, and give your progress a pulse.</p>
          <Link href="/dashboard" className="mt-8 inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
            Create your first project
            <ArrowRight aria-hidden="true" size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}
