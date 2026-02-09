import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/config/dbConfig";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { token, newPassword } = await req.json();

    // Hash the token from URL to compare with DB
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with valid token and check expiry
    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
    }

    // SCENARIO A: If only token is sent (The useEffect check)
    if (!newPassword) {
      return NextResponse.json({ valid: true, message: "Token is valid" });
    }

    // SCENARIO B: If password is also sent (The final form submission)
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    // Clear token fields so it can't be used again
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return NextResponse.json({ success: true, message: "Password reset successful" });

  } catch (error: unknown) {
    console.error("Signup Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}