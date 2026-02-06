import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/app/models/User";
import connectDB from "@/app/config/dbConfig";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
  const { email, password } = await req.json();
const cleanEmail = email.trim().toLowerCase();
const user = await User.findOne({ email: cleanEmail });

    if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { message: "Invalid credentials", success: false },
        { status: 401 }
      );
    }

 const token = jwt.sign(
  { userId: user._id.toString() }, // Ensure it's a string
  process.env.SECRET_KEY!, 
  { expiresIn: "1h" }
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

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 1, // 1 hr in seconds
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