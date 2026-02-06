import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
// 1. Update the interface to match your login payload
interface MyJwtPayload {
  userId: string; // Changed from 'user' to 'userId'
  role?: string;
}

export async function getServerSession(): Promise<MyJwtPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    const decoded = jwt.verify(
      token, 
      process.env.SECRET_KEY!
    ) as unknown as MyJwtPayload;

    // 2. Map the decoded userId to the object you want to return
    return {
      userId: decoded.userId, // This matches what you signed in the POST route
      role: decoded.role || "user",
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error("JWT Verification Error:", error.message);
    }
    return null;
  }
}