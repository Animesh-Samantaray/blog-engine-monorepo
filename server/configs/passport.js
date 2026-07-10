import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import User from "../models/User.model.js";
import AdminEmail from "../models/AdminEmail.model.js";
import jwt from "jsonwebtoken";

// Google OAuth Strategy Configuration
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Extract user information from Google profile
        const { id, displayName, emails, photos } = profile;
        const email = emails[0].value;
        const profilePicture = photos[0]?.value;

        // Check if user already exists with this Google ID
        let user = await User.findOne({ googleId: id });

        if (user) {
          // User exists, return the user
          return done(null, user);
        }

        // Check if user exists with this email (but not Google ID)
        user = await User.findOne({ email });

        if (user) {
          // User exists with email, link Google account
          user.googleId = id;
          user.profileImage = profilePicture || user.profileImage;
          await user.save();
          return done(null, user);
        }

        // Check if email is in AdminEmail collection for role assignment
        const adminEmail = await AdminEmail.findOne({ email });
        const role = adminEmail ? "admin" : "user";

        // Create new user
        user = await User.create({
          googleId: id,
          name: displayName,
          email,
          profileImage: profilePicture,
          role,
          bio: "",
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Serialize user into session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
