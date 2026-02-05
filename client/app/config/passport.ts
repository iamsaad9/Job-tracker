import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import User from "../../models/User"; // Path alias @/app/models/User if configured

/**
 * 1. Define the User interface for Passport 
 * (Ideally, import this from your @/app/models/User file)
 */
interface IUser {
  _id: string;
  name: string;
  username: string;
  email: string;
  googleId?: string | null;
  avatar?: string;
  authProvider?: string;
  password?: string;
}

// 2. Strategy Callback for OAuth
const strategyCallback = async (
  accessToken: string,
  refreshToken: string,
  profile: Profile,
  done: VerifyCallback
) => {
  try {
    const userEmail = profile.emails?.[0]?.value;

    if (!userEmail) {
      return done(new Error("No email found in Google profile"), undefined);
    }

    let user = await User.findOne({
      $or: [
        { googleId: profile.id },
        { email: userEmail },
      ],
    });

    if (!user) {
      user = await User.create({
        name: profile.displayName,
        username: profile.displayName.replace(/\s+/g, '').toLowerCase(),
        email: userEmail,
        googleId: profile.provider === "google" ? profile.id : null,
        avatar: profile.photos?.[0]?.value,
        authProvider: profile.provider,
      });
    } else {
      if (profile.provider === "google" && !user.googleId) {
        user.googleId = profile.id;
      }
      user.authProvider = user.authProvider || profile.provider;
      await user.save();
    }
    return done(null, user as IUser);
  } catch (err) {
    return done(err as Error, undefined);
  }
};

// 3. Local Strategy
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email }).select("+password");
        
        if (!user) {
          return done(null, false, { message: "Invalid email or password." });
        }

        if (!user.password) {
          return done(null, false, {
            message: "Please log in using Google/GitHub.",
          });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Invalid email or password." });
        }

        return done(null, user as IUser);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// 4. Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
    },
    strategyCallback
  )
);