import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/config/dbConfig";
import UserProfile from "@/app/models/UserProfile";
import { getServerSession } from "@/app/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession();
    if (!session) return NextResponse.json({ success: false }, { status: 401 });

    const body = await req.json();
    // For POST, we don't need an experienceId, we just push the whole body
    const { ...experienceForm } = body; 

    const profile = await UserProfile.findOneAndUpdate(
      { user: session.userId },
      { 
        $push: { 
          experience: { $each: [experienceForm], $position: 0 } 
        } 
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({ success: true, data: profile });
  } catch (error: unknown) {
    console.error("Signup Error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // 1. Parse the body exactly as you're sending it
    const body = await req.json();
    
    // Extract experienceId, and gather the rest of the fields into updateData
    const { experienceId, ...updateData } = body;

    if (!experienceId) {
      return NextResponse.json(
        { success: false, message: "Experience ID is required for updates" },
        { status: 400 }
      );
    }

    /**
     * 2. Atomic Update
     * We find the profile belonging to the user that contains the specific experience ID.
     * We then use the positional operator ($) to update ONLY that entry.
     */
    const profile = await UserProfile.findOneAndUpdate(
      { 
        user: session.userId, 
        "experience._id": experienceId 
      },
      { 
        $set: { 
          // The "$" operator points to the index of the experience found above
          "experience.$": { 
            ...updateData, 
            _id: experienceId // Keep the ID consistent
          } 
        } 
      },
      { new: true, runValidators: true }
    );

    if (!profile) {
      return NextResponse.json(
        { success: false, message: "Profile or Experience entry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: profile });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // 1. Get the experienceId from the body
    const { experienceId } = await req.json();

    if (!experienceId) {
      return NextResponse.json(
        { success: false, message: "Experience ID is required" },
        { status: 400 }
      );
    }

    /**
     * 2. Atomic Removal
     * $pull removes any element from an array that matches the condition.
     */
    const profile = await UserProfile.findOneAndUpdate(
      { user: session.userId },
      { 
        $pull: { 
          experience: { _id: experienceId } 
        } 
      },
      { new: true } // Return the updated profile so the UI can refresh
    );

    if (!profile) {
      return NextResponse.json(
        { success: false, message: "Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: "Experience deleted", 
      data: profile 
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}