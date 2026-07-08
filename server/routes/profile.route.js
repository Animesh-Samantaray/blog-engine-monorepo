import express from "express";

import {
  getMyProfile,
  updateProfile,
  getMyBlogs,
  getDashboard,
} from "../controllers/profile.controller.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import uploadMiddleware from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getMyProfile);

router.put(
  "/",
  uploadMiddleware.single("profileImage"),
  updateProfile
);

router.get("/blogs", getMyBlogs);

router.get("/dashboard", getDashboard);

export default router;