import User from "../models/User.model.js";
import Blog from "../models/Blog.model.js";
import Comment from "../models/Comment.model.js";
import deleteImage from "../utils/deleteImage.js";

// ======================================
// Get My Profile
// ======================================

export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    res.status(200).json({
      success: true,
      user,
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
// Update Profile
// ======================================

export const updateProfile = async (req, res) => {
  try {
    const { name, bio } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (name) user.name = name;
    if (bio) user.bio = bio;

    if (req.file) {
      if (user.profileImage && user.profileImage.startsWith("/uploads/")) {
        deleteImage(user.profileImage);
      }
      user.profileImage = `/uploads/${req.file.filename}`;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user,
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
// Get My Blogs
// ======================================

export const getMyBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({
      author: req.user._id,
    }).sort({ createdAt: -1 });

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
// Dashboard
// ======================================

export const getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    const blogs = await Blog.find({
      author: req.user._id,
    }).sort({ createdAt: -1 });

    const totalComments = await Comment.countDocuments({
      user: req.user._id,
    });

    res.status(200).json({
      success: true,

      user,

      totalBlogs: blogs.length,

      totalComments,

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