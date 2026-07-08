import express from "express";

import {
  addComment,
  getCommentsByBlog,
  updateComment,
  deleteComment,
} from "../controllers/comment.controller.js";

import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public
router.get("/:blogId", getCommentsByBlog);

// Protected
router.post("/:blogId", authMiddleware, addComment);

router.put("/:id", authMiddleware, updateComment);

router.delete("/:id", authMiddleware, deleteComment);

export default router;