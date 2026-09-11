import {
  ArrowRight,
  BarChart3,
  ChevronRight,
  FolderKanban,
  Heart,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

const heatmapCells = Array.from({ length: 84 }, (_, index) => {
  const intensity = (index * 7 + index ** 2) % 11;
  return intensity < 2
    ? "bg-zinc-800"
    : intensity < 5
      ? "bg-emerald-950"
      : intensity < 8
        ? "bg-emerald-700"
        : "bg-emerald-400";
});

export default function HeroSection() {
  return (
    <section className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center gap-16 px-5 py-16 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-20 lg:py-20">
      <div className="max-w-2xl animate-[fade-in_700ms_ease-out_both]">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/8 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
          <Sparkles aria-hidden="true" size={14} />
          Built for your next commit
        </div>
        <h1 className="mt-7 max-w-xl text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-white sm:text-7xl">
          Make your
          <span className="block bg-linear-to-r from-emerald-300 via-emerald-400 to-amber-300 bg-clip-text text-transparent">
            progress visible.
          </span>
        </h1>
        <p className="mt-7 max-w-lg text-lg leading-8 text-zinc-400 sm:text-xl">
          DevPulse turns the work behind your code into a signal you can see, share, and build on every day.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-400 px-5 py-3 text-sm font-semibold text-zinc-950 transition-all hover:-translate-y-0.5 hover:bg-emerald-300 hover:shadow-[0_8px_24px_-10px_rgba(52,211,153,0.9)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-300"
          >
            Enter your dashboard
            <ArrowRight aria-hidden="true" size={17} />
          </Link>
          <a
            href="#features"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-white/10 px-5 py-3 text-sm font-semibold text-zinc-300 transition-colors hover:border-white/20 hover:bg-white/6 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-300"
          >
            See what it tracks
            <ChevronRight aria-hidden="true" size={17} />
          </a>
        </div>
        <div className="mt-9 flex items-center gap-3 text-sm text-zinc-500">
          <span className="flex -space-x-2">
            <span className="size-7 rounded-full border-2 border-zinc-950 bg-emerald-300" />
            <span className="size-7 rounded-full border-2 border-zinc-950 bg-amber-300" />
            <span className="size-7 rounded-full border-2 border-zinc-950 bg-sky-300" />
          </span>
          <span>For builders who keep showing up.</span>
        </div>
      </div>

      <div className="relative animate-[fade-in_900ms_150ms_ease-out_both] lg:pt-6">
        <div className="absolute -inset-6 rounded-4xl bg-emerald-400/8 blur-3xl" />
        <div className="relative overflow-hidden rounded-2xl border border-white/12 bg-zinc-900/90 shadow-2xl shadow-black/40 backdrop-blur">
          <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-md bg-emerald-400 text-zinc-950">
                <BarChart3 aria-hidden="true" size={17} />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">Your pulse</p>
                <p className="text-xs text-zinc-500">This week</p>
              </div>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-300">
              <TrendingUp aria-hidden="true" size={14} />
              +24% momentum
            </span>
          </div>
          <div className="p-5 sm:p-7">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-4xl font-semibold tracking-tight text-white">42</p>
                <p className="mt-1 text-sm text-zinc-500">contributions this week</p>
              </div>
              <span className="rounded-full bg-amber-300/10 px-2.5 py-1 text-xs font-semibold text-amber-300">7 day streak</span>
            </div>
            <div className="mt-8 grid grid-flow-col grid-rows-7 gap-1.5 overflow-hidden">
              {heatmapCells.map((color, index) => (
                <span key={index} className={`aspect-square min-w-2.5 rounded-[3px] ${color}`} />
              ))}
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-white/8 bg-white/4 p-3">
                <div className="flex items-center justify-between text-zinc-500"><span className="text-xs">Top project</span><FolderKanban aria-hidden="true" size={14} /></div>
                <p className="mt-2 text-sm font-semibold text-white">Pulse board</p>
                <p className="mt-1 text-xs text-emerald-300">12 contributions</p>
              </div>
              <div className="rounded-lg border border-white/8 bg-white/4 p-3">
                <div className="flex items-center justify-between text-zinc-500"><span className="text-xs">Community love</span><Heart aria-hidden="true" size={14} /></div>
                <p className="mt-2 text-sm font-semibold text-white">128 likes</p>
                <p className="mt-1 text-xs text-amber-300">+18 this week</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
