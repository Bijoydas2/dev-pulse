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
  } catch (error) {
    console.error("Unable to fetch projects", error);
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
      !description.trim()
    ) {
      return NextResponse.json(
        { error: "title and description are required" },
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

    let user = Types.ObjectId.isValid(userId)
      ? await User.findById(userId)
      : null;

    if (!user) {
      user = await User.findOne();
    }

    if (!user) {
      user = await User.create({
        name: "Bijoy",
        email: "bijoy@devpulse.com",
        streakCount: 1,
      });
    }

    const project = await Project.create({
      title: title.trim(),
      description: description.trim(),
      techStack,
      githubUrl,
      userId: user._id,
    });

    const populatedProject = await project.populate(
      "userId",
      "name email streakCount",
    );

    return NextResponse.json(populatedProject, { status: 201 });
  } catch (error) {
    console.error("Unable to create project", error);
    return NextResponse.json(
      { error: "Unable to create project" },
      { status: 500 },
    );
  }
}