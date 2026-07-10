import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import passport from "./configs/passport.js";
import morgan from "morgan";

import connectDB from "./configs/db.js";

import authRoute from "./routes/auth.route.js";
import adminRoute from "./routes/admin.route.js";
import blogRoute from "./routes/blog.route.js";
import commentRoute from "./routes/comment.route.js";
import profileRoute from "./routes/profile.route.js";

const app = express();

connectDB();

app.use(morgan("dev"));

// Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(cookieParser());

// Express Session Configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Passport Initialization
app.use(passport.initialize());
app.use(passport.session());

app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoute);
app.use("/api/admin", adminRoute);
app.use("/api/blog", blogRoute);
app.use("/api/comment", commentRoute);
app.use("/api/profile", profileRoute);

// Home Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Blog Management API is running 🚀",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});