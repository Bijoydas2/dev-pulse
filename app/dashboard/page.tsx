"use client";

import { AlertTriangle, Plus, Trash2, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

import ContributionHeatmap, {
  type ContributionDay,
  type ContributionLevel,
} from "@/components/ContributionHeatmap";
import ProjectCard from "@/components/ProjectCard";
import ProjectFilterBar from "@/components/ProjectFilterBar";
import {
  EmptyProjectsState,
  ProjectCardSkeleton,
} from "@/components/ProjectShowcaseStates";

type Project = {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  userId: string | { _id: string };
  createdAt?: string;
};

type ProjectForm = {
  title: string;
  description: string;
  techStack: string;
  githubUrl: string;
};

const emptyForm: ProjectForm = {
  title: "",
  description: "",
  techStack: "",
  githubUrl: "",
};

function normalizeTag(tag: string) {
  return tag.trim().replace(/^#+/, "").toLowerCase();
}

function createProjectContributions(projects: Project[], weeks = 52): ContributionDay[] {
  const today = new Date();
  const endDate = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
  const days = weeks * 7;
  const counts = new Map<string, number>();

  projects.forEach((project) => {
    if (!project.createdAt) {
      return;
    }

    const createdDate = new Date(project.createdAt);
    if (Number.isNaN(createdDate.getTime())) {
      return;
    }

    const dateKey = createdDate.toISOString().slice(0, 10);
    counts.set(dateKey, (counts.get(dateKey) ?? 0) + 1);
  });

  return Array.from({ length: days }, (_, index) => {
    const date = new Date(endDate);
    date.setUTCDate(endDate.getUTCDate() - (days - index - 1));
    const dateKey = date.toISOString().slice(0, 10);
    const count = counts.get(dateKey) ?? 0;
    const level: ContributionLevel = count === 0
      ? 0
      : count === 1
        ? 1
        : count === 2
          ? 2
          : count === 3
            ? 3
            : 4;

    return { date: dateKey, count, level };
  });
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedTag, setSelectedTag] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [detailsProject, setDetailsProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState<ProjectForm>(emptyForm);

  useEffect(() => {
    async function loadProjects() {
      try {
        const response = await fetch("/api/projects", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Unable to load projects");
        }

        const data = (await response.json()) as Project[];
        setProjects(data);
      } catch {
        setError("Projects could not be loaded right now.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadProjects();
  }, []);

  const tags = projects.flatMap((project) => project.techStack);
  const contributions = createProjectContributions(projects);
  const filteredProjects = selectedTag === "all"
    ? projects
    : projects.filter((project) =>
        project.techStack.some(
          (technology) => normalizeTag(technology) === selectedTag,
        ),
      );

  function openCreateModal() {
    setFormError("");
    setEditingProject(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  }

  function openEditModal(project: Project) {
    const techStack = project.techStack.join(", ");
    setForm({
      title: project.title,
      description: project.description,
      techStack,
      githubUrl: project.githubUrl ?? "",
    });
    setEditingProject(project);
    setFormError("");
    setIsModalOpen(true);
  }

  function closeModal() {
    if (!isSaving) {
      setIsModalOpen(false);
    }
  }

  function updateField(field: keyof ProjectForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    const techStack = form.techStack
      .split(",")
      .map((technology) => technology.trim().replace(/^#/, ""))
      .filter(Boolean);

    setIsSaving(true);

    try {
      const ownerId = editingProject
        ? typeof editingProject.userId === "string"
          ? editingProject.userId
          : editingProject.userId._id
        : undefined;
      const response = await fetch(
        editingProject ? `/api/projects/${editingProject._id}` : "/api/projects",
        {
        method: editingProject ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          techStack,
          githubUrl: form.githubUrl || undefined,
          ...(ownerId ? { userId: ownerId } : {}),
        }),
        },
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to create project");
      }

      setProjects((current) =>
        editingProject
          ? current.map((project) =>
              project._id === editingProject._id ? (data as Project) : project,
            )
          : [data as Project, ...current],
      );
      setSelectedTag("all");
      setForm(emptyForm);
      setEditingProject(null);
      setIsModalOpen(false);
    } catch (submissionError) {
      setFormError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to create project",
      );
    } finally {
      setIsSaving(false);
    }
  }

  function requestDelete(project: Project) {
    setDeletingProject(project);
  }

  async function confirmDelete() {
    if (!deletingProject || isDeleting) {
      return;
    }

    const project = deletingProject;
    const ownerId = typeof project.userId === "string" ? project.userId : project.userId._id;
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/projects/${project._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: ownerId }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to delete project");
      }

      setProjects((current) => current.filter((item) => item._id !== project._id));
      setDetailsProject(null);
      setDeletingProject(null);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete project");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <main className="relative flex-1 overflow-hidden bg-zinc-950 px-5 py-10 text-zinc-100 sm:px-8 lg:py-14">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-96 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.1),transparent_65%)]" />
      <div className="mx-auto max-w-7xl">
        <div className="relative z-10 flex flex-col gap-6 border-b border-white/10 pb-9 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
              Developer dashboard
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Your development pulse
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400">
              Keep your momentum visible and share the projects you are building.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-300"
          >
            <Plus aria-hidden="true" size={17} />
            Create project
          </button>
        </div>

        <section className="relative z-10 mt-8 rounded-2xl border border-emerald-900/20 bg-white p-5 text-zinc-950 shadow-[0_20px_60px_-35px_rgba(16,185,129,0.45)] sm:p-7">
          <ContributionHeatmap contributions={contributions} />
        </section>

        <section className="relative z-10 mt-16">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                Showcase
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Projects</h2>
            </div>
            <span className="text-sm text-zinc-500">{filteredProjects.length} shown</span>
          </div>

          <div className="rounded-xl border border-white/8 bg-zinc-900/70 p-4 shadow-lg shadow-black/10 sm:p-5">
            <ProjectFilterBar
              tags={tags}
              selectedTag={selectedTag}
              onTagChange={setSelectedTag}
            />
          </div>

          {isLoading ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3" aria-label="Loading projects">
              {Array.from({ length: 3 }, (_, index) => (
                <ProjectCardSkeleton key={index} />
              ))}
            </div>
          ) : error ? (
            <p className="py-16 text-center text-sm text-rose-300">{error}</p>
          ) : filteredProjects.length === 0 ? (
            projects.length === 0 ? (
              <EmptyProjectsState onCreateProject={openCreateModal} />
            ) : (
              <div className="mt-6 rounded-xl border border-dashed border-white/15 px-6 py-16 text-center">
                <p className="text-sm text-zinc-400">No projects found for this tag.</p>
              </div>
            )
          ) : (
            <div className="mt-7 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project._id}
                  title={project.title}
                  description={project.description}
                  techStack={project.techStack}
                  githubUrl={project.githubUrl}
                  onEdit={() => openEditModal(project)}
                  onDelete={() => requestDelete(project)}
                  onDetails={() => setDetailsProject(project)}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {isModalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-form-title"
            className="w-full max-w-lg rounded-xl border border-white/10 bg-zinc-900 p-6 shadow-2xl shadow-black/40"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                  {editingProject ? "Edit project" : "New project"}
                </p>
                <h2 id="project-form-title" className="mt-1 text-xl font-semibold text-white">
                  {editingProject ? "Update project" : "Create a project"}
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close project form"
                title="Close"
                onClick={closeModal}
                className="rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-white/6 hover:text-white focus-visible:outline-2 focus-visible:outline-emerald-400"
              >
                <X aria-hidden="true" size={19} />
              </button>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <label className="block text-sm font-medium text-zinc-300">
                Title
                <input
                  required
                  value={form.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  className="mt-1.5 w-full rounded-md border border-white/10 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-emerald-400"
                  placeholder="Pulse board"
                />
              </label>

              <label className="block text-sm font-medium text-zinc-300">
                Description
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(event) => updateField("description", event.target.value)}
                  className="mt-1.5 w-full resize-none rounded-md border border-white/10 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-emerald-400"
                  placeholder="What are you building?"
                />
              </label>

              <label className="block text-sm font-medium text-zinc-300">
                Tech stack
                <input
                  value={form.techStack}
                  onChange={(event) => updateField("techStack", event.target.value)}
                  className="mt-1.5 w-full rounded-md border border-white/10 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-emerald-400"
                  placeholder="nextjs, typescript, mongodb"
                />
              </label>

              <label className="block text-sm font-medium text-zinc-300">
                GitHub URL <span className="font-normal text-zinc-600">(optional)</span>
                <input
                  type="url"
                  value={form.githubUrl}
                  onChange={(event) => updateField("githubUrl", event.target.value)}
                  className="mt-1.5 w-full rounded-md border border-white/10 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-emerald-400"
                  placeholder="https://github.com/..."
                />
              </label>

              {formError ? <p className="text-sm text-rose-300">{formError}</p> : null}

              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex w-full items-center justify-center rounded-md bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving ? "Saving..." : editingProject ? "Save changes" : "Create project"}
              </button>
            </form>
          </section>
        </div>
      ) : null}

      {detailsProject ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setDetailsProject(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-details-title"
            className="w-full max-w-lg rounded-xl border border-white/10 bg-zinc-900 p-6 shadow-2xl shadow-black/40"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">Project details</p>
                <h2 id="project-details-title" className="mt-1 text-2xl font-semibold text-white">{detailsProject.title}</h2>
              </div>
              <button
                type="button"
                aria-label="Close project details"
                title="Close"
                onClick={() => setDetailsProject(null)}
                className="rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-white/6 hover:text-white focus-visible:outline-2 focus-visible:outline-emerald-400"
              >
                <X aria-hidden="true" size={19} />
              </button>
            </div>
            <p className="mt-5 text-sm leading-7 text-zinc-300">{detailsProject.description}</p>
            <div className="mt-6 flex flex-wrap gap-2" aria-label="Project technology stack">
              {detailsProject.techStack.map((technology) => (
                <span key={technology} className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2.5 py-1 text-xs font-semibold text-emerald-200">
                  #{technology.replace(/^#/, "")}
                </span>
              ))}
            </div>
            <div className="mt-7 flex items-center justify-between border-t border-white/8 pt-5">
              <button
                type="button"
                onClick={() => {
                  setDetailsProject(null);
                  openEditModal(detailsProject);
                }}
                className="inline-flex items-center rounded-md border border-white/10 px-3 py-2 text-sm font-semibold text-zinc-300 transition-colors hover:border-emerald-400/40 hover:text-white focus-visible:outline-2 focus-visible:outline-emerald-400"
              >
                Edit project
              </button>
              {detailsProject.githubUrl ? (
                <a
                  href={detailsProject.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold text-emerald-300 hover:text-emerald-200"
                >
                  Open repository
                </a>
              ) : null}
            </div>
          </section>
        </div>
      ) : null}

      {deletingProject ? (
        <div
          className="fixed inset-0 z-60 flex items-end justify-center bg-black/75 p-4 backdrop-blur-sm sm:items-center"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isDeleting) {
              setDeletingProject(null);
            }
          }}
        >
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-project-title"
            aria-describedby="delete-project-description"
            className="w-full max-w-md rounded-2xl border border-rose-300/20 bg-zinc-900 p-6 shadow-2xl shadow-black/50"
          >
            <div className="flex items-start gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-rose-400/10 text-rose-300">
                <AlertTriangle aria-hidden="true" size={22} />
              </span>
              <div>
                <h2 id="delete-project-title" className="text-lg font-semibold text-white">
                  Delete project?
                </h2>
                <p id="delete-project-description" className="mt-2 text-sm leading-6 text-zinc-400">
                  <span className="font-medium text-zinc-200">{deletingProject.title}</span> will be permanently removed. This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeletingProject(null)}
                className="inline-flex items-center justify-center rounded-md border border-white/10 px-4 py-2.5 text-sm font-semibold text-zinc-300 transition-colors hover:bg-white/6 hover:text-white focus-visible:outline-2 focus-visible:outline-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => void confirmDelete()}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-rose-400 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-rose-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-300 disabled:cursor-wait disabled:opacity-60"
              >
                <Trash2 aria-hidden="true" size={16} />
                {isDeleting ? "Deleting..." : "Delete project"}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}