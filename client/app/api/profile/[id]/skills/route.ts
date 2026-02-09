import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/config/dbConfig";
import UserProfile from "@/app/models/UserProfile";
import { getServerSession } from "@/app/lib/auth";

interface UserSession {
  userId: string;
}

// Handler to ADD skills
export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const session: UserSession | null = await getServerSession();
    if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { skills } = body;

    if (!Array.isArray(skills) || skills.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid skills array" }, { status: 400 });
    }

    const profile = await UserProfile.findOneAndUpdate(
      { user: session.userId },
      // $addToSet adds elements to an array only if they do not already exist
      { $addToSet: { skills: { $each: skills } } },
      { new: true }
    );

    return NextResponse.json({ success: true, data: profile?.skills || [] });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

// Handler to DELETE a skill
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const session: UserSession | null = await getServerSession();
    if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { skill } = await req.json(); // The specific string to remove

    if (!skill) {
      return NextResponse.json({ success: false, message: "Skill string required" }, { status: 400 });
    }

    const profile = await UserProfile.findOneAndUpdate(
      { user: session.userId },
      // $pull removes all instances of the value from the array
      { $pull: { skills: skill } },
      { new: true }
    );

    return NextResponse.json({ success: true, data: profile?.skills || [] });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}