import { Types } from "mongoose";
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import User from "@/models/User";

export async function GET() {
  try {
    await connectToDatabase();

    const projects = await Project.find()
      .populate("userId", "name email streakCount")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(projects);
  } catch {
    return NextResponse.json(
      { error: "Unable to fetch projects" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, techStack, githubUrl, userId } = body;

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof description !== "string" ||
      !description.trim() ||
      !Types.ObjectId.isValid(userId)
    ) {
      return NextResponse.json(
        { error: "title, description, and a valid userId are required" },
        { status: 400 },
      );
    }

    if (
      techStack !== undefined &&
      (!Array.isArray(techStack) ||
        techStack.some((technology) => typeof technology !== "string"))
    ) {
      return NextResponse.json(
        { error: "techStack must be an array of strings" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const userExists = await User.exists({ _id: userId });
    if (!userExists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const project = await Project.create({
      title: title.trim(),
      description: description.trim(),
      techStack,
      githubUrl,
      userId,
    });

    const populatedProject = await project.populate(
      "userId",
      "name email streakCount",
    );

    return NextResponse.json(populatedProject, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Unable to create project" },
      { status: 500 },
    );
  }
}