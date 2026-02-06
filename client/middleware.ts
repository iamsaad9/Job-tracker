// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose"; // Install this: npm install jose

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/signup");

  // 1. If trying to access protected route without a token at all
  if (!token && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 2. If a token exists, verify it's not expired
  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.SECRET_KEY);
      await jwtVerify(token, secret);

      // Token is valid: If they are on an auth route (login), send to dashboard
      if (isAuthRoute) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    } catch (err) {
      // Token is EXPIRED or INVALID
      console.log("Token expired or invalid, redirecting to login...");
      
      const response = NextResponse.redirect(new URL("/login", req.url));
      // Delete the bad cookie so we don't get stuck in a loop
      response.cookies.delete("token"); 
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  // Matches all routes except api, _next/static, _next/image, and favicon
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};