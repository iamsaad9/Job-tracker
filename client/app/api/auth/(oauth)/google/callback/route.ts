import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams, origin } = new URL(req.url);
    const token = searchParams.get("token");

    // Default to /dashboard or /oauth-success if env is missing
    const targetPath =
      process.env.NEXT_PUBLIC_OAUTH_SUCCESS_PATH || "/dashboard";

    // Create the full absolute URL for the redirect
    const redirectUrl = new URL(targetPath, origin);

    // Optional: Pass the token in query only if your frontend needs to
    // immediately initialize state, otherwise just rely on the cookie
    if (token) {
      redirectUrl.searchParams.set("token", token);
    }

    const res = NextResponse.redirect(redirectUrl);

    if (token) {
      res.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: "lax", // Recommended for auth redirects
      });
    }

    return res;
  } catch (err) {
    console.error("OAuth Callback Error:", err);
    return NextResponse.redirect(new URL("/login?error=auth_failed", req.url));
  }
}
