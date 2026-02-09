import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/app/models/User";
import connectDB from "@/app/config/dbConfig"; // Assuming you have this helper

// 1. Define the shape of your JWT payload
interface JwtPayload {
  userId: string;
  role?: string;
}

export async function GET() {
  try {
    await connectDB();
    
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 3. Verify token with type casting
    // Use ! to tell TS that SECRET_KEY is definitely defined in .env
    const decoded = jwt.verify(token, process.env.SECRET_KEY!) as unknown as JwtPayload;
    
  console.log("Decoded Token:", decoded); // <--- Check this in your terminal!

  const user = await User.findById(decoded.userId).select("-password");
  console.log("Database Result:", user);
    // 4. Fetch user

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

   return NextResponse.json({ user: user });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}