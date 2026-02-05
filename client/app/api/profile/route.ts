import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/config/dbConfig";
import UserProfile from "@/app/models/UserProfile";
import { getServerSession } from "@/app/lib/auth";

// Define the Session shape
interface UserSession {
  user: string;
}

// Define the Profile shape (matches your Mongoose schema)
interface IProfile {
  user: string;
  bio?: string;
  skills?: string[];
  location?: string;
  website?: string;
  // ... add other specific fields here
}
// GET current profile (/api/profile)
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const session: UserSession | null = await getServerSession();
    if (!session) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    // Populate brings in fields from the 'User' collection
    const profile = await UserProfile.findOne({
      user: session.user,
    }).populate("user", ["username", "email"]);

    if (!profile) {
      return NextResponse.json(
        { success: false, message: "Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: profile });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST/UPSERT profile (/api/profile)
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const session: UserSession | null = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { success: false, message: "Missing or empty body" },
        { status: 400 }
      );
    }

    // Explicitly link the user ID from the session, not the client-side body
    const profileFields: Partial<IProfile> = { 
      ...body, 
      user: session.user 
    };

    const profile = await UserProfile.findOneAndUpdate(
      { user: session.user },
      { $set: profileFields },
      { 
        new: true, 
        upsert: true, 
        runValidators: true,
        setDefaultsOnInsert: true 
      }
    );

    return NextResponse.json({ success: true, data: profile });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}