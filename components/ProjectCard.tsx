"use client";

import { ExternalLink, Info, Pencil, Trash2 } from "lucide-react";

export type ProjectCardData = {
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  onEdit: () => void;
  onDelete: () => void;
  onDetails: () => void;
};

type ProjectCardProps = ProjectCardData;

export default function ProjectCard({
  title,
  description,
  techStack,
  githubUrl,
  onEdit,
  onDelete,
  onDetails,
}: ProjectCardProps) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-zinc-900 p-5 text-zinc-100 shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-300/50 hover:shadow-[0_0_30px_-12px_rgba(52,211,153,0.7)]">
      <div className="pointer-events-none absolute inset-x-8 -top-px h-px bg-linear-to-r from-transparent via-emerald-300/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-xl font-semibold tracking-tight text-white">{title}</h3>
      </div>

      <p className="mt-3 flex-1 text-sm leading-6 text-zinc-400">{description}</p>

      <div className="mt-5 flex flex-wrap gap-2" aria-label="Technology stack">
        {techStack.map((technology) => (
          <span
            key={technology}
            className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-emerald-200"
          >
            #{technology.replace(/^#/, "")}
          </span>
        ))}
      </div>

      {githubUrl ? (
        <a
          href={githubUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex w-fit items-center gap-2 text-sm font-medium text-zinc-400 transition-all hover:translate-x-0.5 hover:text-emerald-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-400"
        >
          View repository
          <ExternalLink aria-hidden="true" size={15} className="transition-transform group-hover:translate-x-0.5" />
        </a>
      ) : null}

      <div className="mt-5 flex items-center justify-between border-t border-white/8 pt-4">
        <button
          type="button"
          onClick={onDetails}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-emerald-400"
        >
          <Info aria-hidden="true" size={14} />
          Details
        </button>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onEdit}
            aria-label={`Edit ${title}`}
            title="Edit project"
            className="rounded-md p-2 text-zinc-500 transition-colors hover:bg-white/6 hover:text-emerald-300 focus-visible:outline-2 focus-visible:outline-emerald-400"
          >
            <Pencil aria-hidden="true" size={15} />
          </button>
          <button
            type="button"
            onClick={onDelete}
            aria-label={`Delete ${title}`}
            title="Delete project"
            className="rounded-md p-2 text-zinc-500 transition-colors hover:bg-rose-400/10 hover:text-rose-300 focus-visible:outline-2 focus-visible:outline-rose-400"
          >
            <Trash2 aria-hidden="true" size={15} />
          </button>
        </div>
      </div>
    </article>
  );
}