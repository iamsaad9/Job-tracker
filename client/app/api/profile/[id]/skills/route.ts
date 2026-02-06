import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/config/dbConfig";
import UserProfile from "@/app/models/UserProfile";
import { getServerSession } from "@/app/lib/auth";

// 1. Define specific interfaces
interface UserSession {
  userId: string;
}

interface SkillsRequestBody {
  skills: string[];
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    
    // 2. Validate session
    const session: UserSession | null = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 3. Extract and type the body
    const body: SkillsRequestBody = await req.json();
    const skills = body?.skills;

    // 4. Strict array validation
    if (!Array.isArray(skills) || skills.length === 0) {
      return NextResponse.json(
        { success: false, message: "skills must be a non-empty array of strings" },
        { status: 400 }
      );
    }

    // 5. Atomic Update
    // $addToSet ensures no duplicate strings are added to the skills array
    const profile = await UserProfile.findOneAndUpdate(
      { user: session.userId },
      { $addToSet: { skills: { $each: skills } } },
      { new: true }
    );

    if (!profile) {
      return NextResponse.json(
        { success: false, message: "Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: profile.skills });

  } catch (error) {
    // 6. Strict error handling using instanceof
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}8