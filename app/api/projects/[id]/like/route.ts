import { Types } from "mongoose";
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";

type LikeRouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: LikeRouteContext) {
  const { id } = await context.params;

  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const increment = body.liked === false ? -1 : 1;
    await connectToDatabase();
    const project = await Project.findByIdAndUpdate(
      id,
      { $inc: { likes: increment } },
      { new: true, runValidators: true },
    ).select("likes");

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ likes: project.likes });
  } catch (error) {
    console.error("Unable to update project like", error);
    return NextResponse.json({ error: "Unable to update project like" }, { status: 500 });
  }
}