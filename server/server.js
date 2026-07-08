import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./configs/db.js";

import authRoute from "./routes/auth.route.js";
import adminRoute from "./routes/admin.route.js";
import blogRoute from "./routes/blog.route.js";
import commentRoute from "./routes/comment.route.js";
import profileRoute from "./routes/profile.route.js";

dotenv.config();

const app = express();

connectDB();

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use(cookieParser());

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