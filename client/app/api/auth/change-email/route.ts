import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/config/dbConfig";
import User from "@/app/models/User";
import UserProfile from "@/app/models/UserProfile";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface DecodedToken {
  userId: string;
  iat?: number;
  exp?: number;
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // 1. Get Token from Cookies
    const token = req.cookies.get("token")?.value || "";
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2. Decode Token to get User ID
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY!) as DecodedToken;
    const userId = decodedToken.userId;

    const { newEmail, password } = await req.json();

    // 3. Find User (Include password for verification)
    const user = await User.findById(userId).select("+password");
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // 4. Security Check: Block Google/OAuth users from changing email manually
    // Since Google is the source of truth for their email
    if (user.provider === "google" || user.googleId) {
      return NextResponse.json(
        { message: "Accounts linked to Google must change email via Google settings." },
        { status: 400 }
      );
    }

    // 5. Verify Current Password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json({ message: "Incorrect password" }, { status: 401 });
    }

    // 6. Check if New Email is already taken
    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser) {
      return NextResponse.json({ message: "Email is already in use" }, { status: 400 });
    }

    // 7. Update User and UserProfile (Dual Update)
    // We use a Promise.all to run these concurrently
    await Promise.all([
      User.findByIdAndUpdate(userId, { email: newEmail }),
      UserProfile.findOneAndUpdate({ user: userId }, { email: newEmail })
    ]);

    return NextResponse.json({
      success: true,
      message: "Email updated successfully in both User and Profile.",
    });

  } catch (error: unknown) {
    console.error("Change Email Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
}