import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/config/dbConfig";
import UserProfile from "@/app/models/UserProfile";
import User from "@/app/models/User";
import { Document, Types } from "mongoose";

// 1. Define the User interface for the lookup
interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  firstName?: string;
  lastName?: string;
}

// 2. Define the Route Context (Next.js 15 Params are Promises)
interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    await connectDB();
    
    // In Next.js 15, we must await the params
    const { id } = await params;

    // 3. Try username lookup first
    // We type the result as IUser or null
    let user: IUser | null = await User.findOne({ username: id });

    if (!user) {
      // 4. Fallback to ID lookup with basic validation
      // Check if it's a valid ObjectId format to prevent Mongoose cast errors
      const isValidId = Types.ObjectId.isValid(id);
      
      if (isValidId) {
        user = await User.findById(id);
      }
    }

    if (!user) {
      return NextResponse.json(
        { message: "User not found", success: false }, 
        { status: 404 }
      );
    }

    // 5. Fetch and populate profile
    const profile = await UserProfile.findOne({ user: user._id }).populate(
      "user",
      ["username", "firstName", "lastName"]
    );

    if (!profile) {
      return NextResponse.json(
        { message: "Profile not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: profile });
  } catch (error: unknown) {
    // 6. Handle error without 'any'
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}