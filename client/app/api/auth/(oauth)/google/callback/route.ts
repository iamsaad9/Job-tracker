import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/app/models/User";
import connectDB from "@/app/config/dbConfig";
import UserProfile from "@/app/models/UserProfile"; 

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // 1. Get the code from the Google Redirect URL
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.redirect(new URL("/login?error=no_code", req.url));
    }

    // 2. Exchange Authorization Code for Access Token
   const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    code,
    // You can use the NEXT_PUBLIC one here too! 
    // It's already loaded into the server environment.
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID, 
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google/callback`,
    grant_type: "authorization_code",
  }),
});

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      console.error("Token Exchange Error:", tokenData);
      return NextResponse.redirect(new URL("/login?error=token_exchange_failed", req.url));
    }

    // 3. Fetch User Profile from Google using the Access Token
    const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const googleUser = await userRes.json();

    // 4. Find or Create User (Your Passport logic, but for Next.js)
    // 4. Find or Create User
    let user = await User.findOne({ email: googleUser.email });

    if (!user) {
      // Step A: Create the User
      // Using a plain object to ensure we don't have proxy issues
      const newUser = await User.create({
        name: googleUser.name,
        email: googleUser.email,
        googleId: googleUser.sub,
        avatar: googleUser.picture,
        provider: "google",
        password: null, 
      });

      if (newUser && newUser._id) {
        // Step B: Create the Profile using the explicit ID from the new object
        await UserProfile.create({
          user: newUser._id, 
          name: googleUser.name,
          email: googleUser.email,
        });
        
        // Assign newUser to user so the rest of the code (JWT) can use it
        user = newUser;
      } else {
        throw new Error("User creation failed, could not generate ID.");
      }
      
    } else {
      // Step C: Update existing user if they are linking Google for the first time
      let isModified = false;
      if (!user.googleId) {
        user.googleId = googleUser.sub;
        isModified = true;
      }
      if (!user.avatar) {
        user.avatar = googleUser.picture;
        isModified = true;
      }
      if (isModified) await user.save();

      // Step D: Ensure a profile exists even for old users 
      // (Optional safety check in case a user exists but profile creation failed before)
      const existingProfile = await UserProfile.findOne({ user: user._id });
      if (!existingProfile) {
        await UserProfile.create({
          user: user._id,
          name: user.name,
          email: user.email,
        });
      }
    }

    // 5. Generate your custom JWT
    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.SECRET_KEY!,
      { expiresIn: "1d" }
    );

    // 6. Set Cookie and Redirect to Dashboard
    const response = NextResponse.redirect(new URL("/dashboard", req.url));
    
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
      sameSite: "lax",
    });

    return response;

  } catch (error) {
    console.error("Google Auth Error:", error);
    return NextResponse.redirect(new URL("/login?error=internal_error", req.url));
  }
}