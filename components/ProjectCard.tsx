"use client";

import { ExternalLink, Heart } from "lucide-react";
import { useState } from "react";

export type ProjectCardData = {
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  likes?: number;
};

type ProjectCardProps = ProjectCardData;

export default function ProjectCard({
  title,
  description,
  techStack,
  githubUrl,
  likes = 0,
}: ProjectCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const likeCount = likes + (isLiked ? 1 : 0);

  return (
    <article className="flex h-full flex-col rounded-xl border border-white/10 bg-zinc-900 p-5 text-zinc-100 shadow-lg shadow-black/10 transition-colors hover:border-emerald-400/40">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold tracking-tight text-white">{title}</h3>
        <button
          type="button"
          aria-label={isLiked ? `Unlike ${title}` : `Like ${title}`}
          aria-pressed={isLiked}
          title={isLiked ? "Unlike project" : "Like project"}
          onClick={() => setIsLiked((liked) => !liked)}
          className={`flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 ${
            isLiked
              ? "text-rose-400 hover:bg-rose-400/10"
              : "text-zinc-500 hover:bg-white/6 hover:text-rose-300"
          }`}
        >
          <Heart aria-hidden="true" size={17} fill={isLiked ? "currentColor" : "none"} />
          <span>{likeCount}</span>
        </button>
      </div>

      <p className="mt-3 flex-1 text-sm leading-6 text-zinc-400">{description}</p>

      <div className="mt-5 flex flex-wrap gap-2" aria-label="Technology stack">
        {techStack.map((technology) => (
          <span
            key={technology}
            className="rounded-md border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-300"
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
          className="mt-5 inline-flex w-fit items-center gap-2 text-sm font-medium text-zinc-300 transition-colors hover:text-emerald-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-400"
        >
          View repository
          <ExternalLink aria-hidden="true" size={15} />
        </a>
      ) : null}
    </article>
  );
}