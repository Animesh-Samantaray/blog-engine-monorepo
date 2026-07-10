import User from "../models/User.model.js";
import Blog from "../models/Blog.model.js";
import Comment from "../models/Comment.model.js";
import AdminEmail from "../models/AdminEmail.model.js";
import deleteImage from "../utils/deleteImage.js";

// ======================================
// Dashboard Statistics
// ======================================

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBlogs = await Blog.countDocuments();
    const totalComments = await Comment.countDocuments();

    const latestUsers = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(5);

    const latestBlogs = await Blog.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalBlogs,
        totalComments,
      },
      latestUsers,
      latestBlogs,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ======================================
// Get All Users
// ======================================

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ======================================
// Delete User
// ======================================

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Find user's blogs to delete their cover images
    const userBlogs = await Blog.find({ author: id });
    for (const blog of userBlogs) {
      if (blog.image) {
        deleteImage(blog.image);
      }
    }

    // Delete comments on user's blogs
    const blogIds = userBlogs.map((blog) => blog._id);
    await Comment.deleteMany({ blog: { $in: blogIds } });

    // Delete user's blogs
    await Blog.deleteMany({ author: id });

    // Delete user's comments
    await Comment.deleteMany({ user: id });

    // Delete user's profile image if local
    if (user.profileImage && user.profileImage.startsWith("/uploads/")) {
      deleteImage(user.profileImage);
    }

    // Delete user
    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ======================================
// Get All Blogs
// ======================================

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: blogs.length,
      blogs,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ======================================
// Delete Any Blog
// ======================================

export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found.",
      });
    }

    // Delete comments related to this blog
    await Comment.deleteMany({ blog: id });

    // Delete blog cover image
    if (blog.image) {
      deleteImage(blog.image);
    }

    // Delete blog
    await Blog.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ======================================
// Add Admin Email
// ======================================

export const addAdmin = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    // Check if email already exists in AdminEmail collection
    const existingAdminEmail = await AdminEmail.findOne({ email });

    if (existingAdminEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists in admin list.",
      });
    }

    // Add email to AdminEmail collection
    await AdminEmail.create({
      email,
      createdBy: req.user.name,
    });

    // If user exists with this email, update their role to admin
    const user = await User.findOne({ email });
    if (user) {
      user.role = "admin";
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: "Admin email added successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ======================================
// Remove Admin Email
// ======================================

export const removeAdmin = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    // Check if email exists in AdminEmail collection
    const adminEmail = await AdminEmail.findOne({ email });

    if (!adminEmail) {
      return res.status(404).json({
        success: false,
        message: "Email not found in admin list.",
      });
    }

    // Remove email from AdminEmail collection
    await AdminEmail.deleteOne({ email });

    // If user exists with this email, update their role to user
    const user = await User.findOne({ email });
    if (user) {
      user.role = "user";
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: "Admin email removed successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ======================================
// Get All Admin Emails
// ======================================

export const getAdminEmails = async (req, res) => {
  try {
    const adminEmails = await AdminEmail.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: adminEmails.length,
      adminEmails,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};