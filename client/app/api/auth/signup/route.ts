import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/config/dbConfig";
import User from "@/app/models/User";
import UserProfile from "@/app/models/UserProfile"; // Import the Profile model
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name, email, password } = await req.json();

    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    // 2. Hash password and create User
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`,
    });

    await UserProfile.create({
      user: newUser._id, // Link to the new User's ID
      name: `${name}`,
      email:`${email}`
    });

    return NextResponse.json({ 
      success: true, 
      message: "User and Profile created successfully" 
    }, { status: 201 });

  } catch (error: unknown) {
    console.error("Signup Error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}