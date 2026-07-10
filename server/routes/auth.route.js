import express from "express";
import passport from "../configs/passport.js";
import createToken from "../utils/createToken.js";

import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/auth.controller.js";

const router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Logout
router.post("/logout", logoutUser);

// Google OAuth Routes
// Initiates Google OAuth flow
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL || "http://localhost:5173"}/login`,
    session: false,
  }),
  (req, res) => {
    try {
      const token = createToken(req.user._id);
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })
        .redirect(`${process.env.CLIENT_URL || "http://localhost:5173"}/`);
    } catch (error) {
      console.error("Google OAuth token creation failed:", error);
      res.redirect(`${process.env.CLIENT_URL || "http://localhost:5173"}/login`);
    }
  }
);

export default router;