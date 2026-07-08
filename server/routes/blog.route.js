import express from "express";

import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  searchBlogs,
  getBlogsByCategory,
} from "../controllers/blog.controller.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import uploadMiddleware from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Public Routes
router.get("/", getAllBlogs);

router.get("/search", searchBlogs);

router.get("/category/:category", getBlogsByCategory);

router.get("/:id", getBlogById);

// Protected Routes
router.post("/", authMiddleware, uploadMiddleware.single("image"), createBlog);

router.put("/:id", authMiddleware, uploadMiddleware.single("image"), updateBlog);

router.delete("/:id", authMiddleware, deleteBlog);

export default router;