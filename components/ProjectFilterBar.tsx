"use client";

import { Check, ListFilter } from "lucide-react";

type ProjectFilterBarProps = {
  tags: string[];
  selectedTag: string;
  onTagChange: (tag: string) => void;
};

export default function ProjectFilterBar({
  tags,
  selectedTag,
  onTagChange,
}: ProjectFilterBarProps) {
  const uniqueTags = Array.from(new Set(tags.map((tag) => tag.replace(/^#/, ""))));

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 text-sm font-medium text-zinc-300">
        <ListFilter aria-hidden="true" size={17} className="text-emerald-400" />
        <span>Filter projects</span>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects by technology">
        <button
          type="button"
          aria-pressed={selectedTag === "all"}
          onClick={() => onTagChange("all")}
          className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 ${
            selectedTag === "all"
              ? "border-emerald-400 bg-emerald-400 text-zinc-950"
              : "border-white/10 bg-white/4 text-zinc-400 hover:border-emerald-400/40 hover:text-white"
          }`}
        >
          {selectedTag === "all" ? <Check aria-hidden="true" size={14} /> : null}
          All
        </button>

        {uniqueTags.map((tag) => {
          const isSelected = selectedTag === tag;

          return (
            <button
              key={tag}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onTagChange(tag)}
              className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 ${
                isSelected
                  ? "border-emerald-400 bg-emerald-400 text-zinc-950"
                  : "border-white/10 bg-white/4 text-zinc-400 hover:border-emerald-400/40 hover:text-white"
              }`}
            >
              {isSelected ? <Check aria-hidden="true" size={14} /> : null}
              #{tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}