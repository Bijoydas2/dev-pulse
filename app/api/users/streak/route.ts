import { Types } from "mongoose";
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: "A valid userId is required" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { streakCount: 1 } },
      { new: true, runValidators: true },
    ).select("name email streakCount");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch {
    return NextResponse.json(
      { error: "Unable to update user streak" },
      { status: 500 },
    );
  }
}