import express from "express";
import {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  getAllBlogs,
  deleteBlog,
  addAdmin,
  removeAdmin,
  getAdminEmails,
} from "../controllers/admin.controller.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.use(authMiddleware, adminMiddleware);

router.get("/dashboard", getDashboardStats);

router.get("/users", getAllUsers);

router.delete("/users/:id", deleteUser);

router.get("/blogs", getAllBlogs);

router.delete("/blogs/:id", deleteBlog);

// Admin Management Routes
router.get("/admins", getAdminEmails);

router.post("/add-admin", addAdmin);

router.delete("/remove-admin", removeAdmin);

export default router;