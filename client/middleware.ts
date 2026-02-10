import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// 1. Explicitly define which routes NEED a login
const protectedRoutes = ["/dashboard", "/profile", "/settings", "/documents"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  // Check if the current route is in our protected list
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  
  const isAuthRoute = 
    pathname.startsWith("/login") || 
    pathname.startsWith("/signup") || 
    pathname.startsWith("/reset-password");

  // LOGIC A: If it's NOT a protected route, let it pass immediately 
  // (This covers your /assets, /images, /favicon, etc.)
  if (!isProtectedRoute && !isAuthRoute) {
    return NextResponse.next();
  }

  // LOGIC B: If it's a protected route and no token, go to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // LOGIC C: Token Verification
  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.SECRET_KEY);
      await jwtVerify(token, secret);

      // If valid token and trying to access login/signup, go to dashboard
      if (isAuthRoute) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // Only redirect to login if they were actually trying to access a protected page
      if (isProtectedRoute) {
        const response = NextResponse.redirect(new URL("/login", req.url));
        response.cookies.delete("token");
        return response;
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  /*
   * We still need to exclude internal Next.js paths to keep the app fast,
   * but we don't need to list "assets" here anymore because of our logic above.
   */
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};