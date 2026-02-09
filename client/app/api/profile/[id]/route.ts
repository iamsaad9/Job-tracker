import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/config/dbConfig";
import UserProfile from "@/app/models/UserProfile";
import { getServerSession } from "@/app/lib/auth";

// Define the Session shape to match your decoded JWT
interface UserSession {
  userId: string;
  role?: string;
}

interface IProfile {
  user: string;
  bio?: string;
  skills?: string[];
  location?: string;
  website?: string;
}

// GET current profile (/api/profile)
export async function GET() {
  try {
    await connectDB();
    
    // session will be { userId: '...', role: '...' } | null
    const session = await getServerSession() as UserSession | null; 
    
    if (!session || !session.userId) {
      return NextResponse.json({ success: false, message: "No session" }, { status: 401 });
    }

    // Query using session.userId (not session.user)
    const profile = await UserProfile.findOne({
      user: session.userId, 
    }).populate("user", ["name", "email", "avatar"]); 

    console.log("PROFILE FETCHED FOR USER: ", session.userId);

    if (!profile) {
      return NextResponse.json({ success: false, message: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST/UPSERT profile (/api/profile)
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const session = await getServerSession() as UserSession | null;
    
    if (!session || !session.userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    
    // Prepare fields using the userId from the secure session
    const profileFields: Partial<IProfile> = { 
      ...body, 
      user: session.userId // Injecting the ID from JWT for security
    };

    // findOneAndUpdate with upsert: true handles the "Create if not exists" logic
    const profile = await UserProfile.findOneAndUpdate(
      { user: session.userId }, 
      { $set: profileFields },
      { 
        new: true, 
        upsert: true, 
        runValidators: true,
        setDefaultsOnInsert: true 
      }
    ).populate("user", ["name", "email", "avatar"]);

    return NextResponse.json({ success: true, data: profile });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    console.error("Profile POST Error:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}