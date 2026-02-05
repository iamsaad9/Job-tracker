import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

/**
 * 1. Define the shape of your JWT payload.
 * This ensures TypeScript knows exactly what properties are in the token.
 */
interface MyJwtPayload {
  user: string;
  role?: string;
}

/**
 * Helper to get the current user session from HTTP-only cookies.
 */
export async function getServerSession(): Promise<MyJwtPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return null;
    }

    /**
     * 2. Verify and Cast.
     * We use 'as MyJwtPayload' so TS treats 'decoded' as our interface.
     * We use '!' on SECRET_KEY to tell TS the environment variable is defined.
     */
    const decoded = jwt.verify(
      token, 
      process.env.SECRET_KEY!
    ) as unknown as MyJwtPayload;

    // Return the decoded data with strict typing
    return {
      user: decoded.user,
      role: decoded.role || "user",
    };
  } catch (error) {
    // 3. Handle error without 'any' or 'unknown' access
    if (error instanceof Error) {
      console.error("JWT Verification Error:", error.message);
    }
    return null;
  }
}