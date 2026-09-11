import { Types } from "mongoose";
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";

type ProjectRouteContext = {
  params: Promise<{ id: string }>;
};

function getOwnerId(value: unknown) {
  return typeof value === "string" && Types.ObjectId.isValid(value)
    ? value
    : null;
}

function validateProjectFields(body: Record<string, unknown>) {
  const { title, description, techStack, githubUrl } = body;

  if (
    typeof title !== "string" ||
    !title.trim() ||
    typeof description !== "string" ||
    !description.trim()
  ) {
    return "title and description are required";
  }

  if (
    techStack !== undefined &&
    (!Array.isArray(techStack) ||
      techStack.some((technology) => typeof technology !== "string"))
  ) {
    return "techStack must be an array of strings";
  }

  if (githubUrl !== undefined && typeof githubUrl !== "string") {
    return "githubUrl must be a string";
  }

  return null;
}

async function findOwnedProject(id: string, userId: string) {
  await connectToDatabase();
  const project = await Project.findOne({ _id: id, userId }).populate(
    "userId",
    "name email streakCount",
  );
  return project;
}

export async function PUT(request: Request, context: ProjectRouteContext) {
  const { id } = await context.params;

  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const userId = getOwnerId(body.userId);
    const validationError = validateProjectFields(body);

    if (!userId) {
      return NextResponse.json({ error: "A valid userId is required" }, { status: 401 });
    }

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const project = await findOwnedProject(id, userId);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    project.title = (body.title as string).trim();
    project.description = (body.description as string).trim();
    project.techStack = (body.techStack as string[] | undefined)?.map((tag) => tag.trim()).filter(Boolean) ?? [];
    project.githubUrl = typeof body.githubUrl === "string" ? body.githubUrl.trim() : undefined;
    await project.save();

    return NextResponse.json(project);
  } catch (error) {
    console.error("Unable to update project", error);
    return NextResponse.json({ error: "Unable to update project" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: ProjectRouteContext) {
  const { id } = await context.params;

  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
  }

  try {
    const body = (await request.json()) as { userId?: unknown };
    const userId = getOwnerId(body.userId);

    if (!userId) {
      return NextResponse.json({ error: "A valid userId is required" }, { status: 401 });
    }

    const project = await Project.findOneAndDelete({ _id: id, userId });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Unable to delete project", error);
    return NextResponse.json({ error: "Unable to delete project" }, { status: 500 });
  }
}