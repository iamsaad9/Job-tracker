import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/app/models/User";
import connectDB from "@/lib/mongodb"; // Assuming you have this helper

// 1. Define the shape of your JWT payload
interface JwtPayload {
  userId: string;
  role?: string;
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    // 2. Accessing cookies (Note: in Next.js 15+, cookies() is async)
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 3. Verify token with type casting
    // Use ! to tell TS that SECRET_KEY is definitely defined in .env
    const decoded = jwt.verify(token, process.env.SECRET_KEY!) as unknown as JwtPayload;
    
    const { password, newPassword } = await req.json();

    // 4. Fetch user
    const user = await User.findById(decoded.userId).select("+password");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // 5. OAuth Check (Security)
    if (!user.password) {
      return NextResponse.json({
        success: false,
        message: "Password change not available for OAuth users",
      }, { status: 400 });
    }

    // 6. Validate old password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ 
        success: false, 
        message: "Invalid password" 
      }, { status: 401 });
    }

    // 7. Hash and Save
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return NextResponse.json({ success: true, message: "Changed" });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}