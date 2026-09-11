import { FolderOpen, Plus } from "lucide-react";

type EmptyProjectsStateProps = {
  onCreateProject: () => void;
};

export function EmptyProjectsState({ onCreateProject }: EmptyProjectsStateProps) {
  return (
    <div className="mt-6 flex flex-col items-center rounded-xl border border-dashed border-white/15 px-6 py-16 text-center">
      <span className="flex size-11 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
        <FolderOpen aria-hidden="true" size={21} />
      </span>
      <h3 className="mt-4 text-lg font-semibold text-white">No projects found</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">
        Start your showcase with the first project you are building.
      </p>
      <button
        type="button"
        onClick={onCreateProject}
        className="mt-5 inline-flex items-center gap-2 rounded-md bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-300"
      >
        <Plus aria-hidden="true" size={17} />
        Create project
      </button>
    </div>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="h-64 animate-pulse rounded-xl border border-white/10 bg-zinc-900 p-5">
      <div className="h-6 w-2/3 rounded bg-white/10" />
      <div className="mt-4 space-y-2">
        <div className="h-3 w-full rounded bg-white/6" />
        <div className="h-3 w-5/6 rounded bg-white/6" />
        <div className="h-3 w-2/3 rounded bg-white/6" />
      </div>
      <div className="mt-7 flex gap-2">
        <div className="h-6 w-16 rounded-full bg-emerald-400/10" />
        <div className="h-6 w-20 rounded-full bg-emerald-400/10" />
      </div>
      <div className="mt-8 h-4 w-32 rounded bg-white/6" />
    </div>
  );
}