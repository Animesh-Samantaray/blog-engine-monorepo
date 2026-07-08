import User from "../models/User.model.js";
import Blog from "../models/Blog.model.js";
import Comment from "../models/Comment.model.js";

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

    // Delete user's blogs
    await Blog.deleteMany({ author: id });

    // Delete user's comments
    await Comment.deleteMany({ user: id });

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