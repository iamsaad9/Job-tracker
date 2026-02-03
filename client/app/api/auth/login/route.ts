import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import connectDB from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    // 1. Destructure with types
    const { email, password } = await req.json();

    // 2. Find user
    // If you haven't typed your model yet, 'user' might be 'any' or Document
    const user = await User.findOne({ email });

    // 3. Validation logic
    // We use optional chaining or type guards to ensure password exists
    if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { message: "Invalid credentials", success: false },
        { status: 401 }
      );
    }

    // 4. JWT Signing
    // ! tells TS process.env.SECRET_KEY is defined
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.SECRET_KEY!, 
      { expiresIn: "1d" }
    );

    const response = NextResponse.json({ 
      message: "Logged in successfully", 
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });

    // 5. Secure Cookie Setting
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day in seconds
      sameSite: "lax"
    });

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}