import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/config/dbConfig";
import UserProfile from "@/app/models/UserProfile";
import { getServerSession } from "@/app/lib/auth";

// Define the Session shape
interface UserSession {
  userId: string;
}

// Define the shape of a single Experience entry
interface EducationEntry {
  degree: string;
  institution:string;
  startDate: Date;
  endDate?: Date;
  grade: string;
  description?: string;
}
export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    
    // 1. Get Session with explicit type
    const session: UserSession | null = await getServerSession();
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Parse and type the body
    const body: EducationEntry = await req.json();
    
    if (!body || !body.degree || !body.institution) {
      return NextResponse.json(
        { success: false, message: "Required education fields missing" },
        { status: 400 }
      );
    }

    // 3. Atomic Update
    // We use $push with $position: 0 to simulate an 'unshift' in MongoDB
    const profile = await UserProfile.findOneAndUpdate(
      { user: session.userId },
      { 
        $push: { 
          education: { 
            $each: [body], 
            $position: 0 
          } 
        } 
      },
      { new: true, runValidators: true }
    );

    if (!profile) {
      return NextResponse.json(
        { success: false, message: "Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: profile });

  } catch (error) {
    // 4. Handle error strictly using Type Guard
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
