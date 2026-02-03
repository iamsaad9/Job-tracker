import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../../models/User.js";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";

// Strategy Configuration
const strategyCallback = async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({
      $or: [
        { googleId: profile.id },
        { email: profile.emails[0].value },
      ],
    });

    if (!user) {
      user = await User.create({
        name: profile.displayName,
        username: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.provider === "google" ? profile.id : null,
        avatar: profile.photos?.[0]?.value,
        authProvider: profile.provider,
      });
    } else {
      // Link provider if missing
      if (profile.provider === "google" && !user.googleId) {
        user.googleId = profile.id;
      }
     

      // Optional: track multiple providers
      user.authProvider = user.authProvider || profile.provider;
      await user.save();
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
};

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id);
//     done(null, user);
//   } catch (err) {
//     done(err, null);
//   }
// });

passport.use(
  new LocalStrategy(
    { usernameField: "email" }, // Tell passport we use 'email' instead of 'username'
    async (email, password, done) => {
      try {
        // 1. Find the user
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
          return done(null, false, { message: "Invalid email or password." });
        }

        if (!user.password) {
          return done(null, false, {
            message: "Please log in using Google/GitHub.",
          });
        }

        // 3. Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Invalid email or password." });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
    },
    strategyCallback,
  ),
);
