import { ExternalLink, Flame, GitBranch } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/8">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex items-center gap-2 text-zinc-300">
          <span className="flex size-6 items-center justify-center rounded bg-emerald-400 text-zinc-950">
            <Flame aria-hidden="true" size={14} />
          </span>
          <span className="font-semibold">DevPulse</span>
        </div>
        <p>Make progress visible.</p>
        <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="DevPulse on GitHub" className="inline-flex items-center gap-2 transition-colors hover:text-white">
          <GitBranch aria-hidden="true" size={16} />
          GitHub
          <ExternalLink aria-hidden="true" size={13} />
        </a>
      </div>
    </footer>
  );
}
