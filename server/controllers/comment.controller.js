import Comment from "../models/Comment.model.js";
import Blog from "../models/Blog.model.js";

// ======================================
// Add Comment
// ======================================

export const addComment = async (req, res) => {
  try {
    const { comment } = req.body;
    const { blogId } = req.params;

    if (!comment) {
      return res.status(400).json({
        success: false,
        message: "Comment cannot be empty.",
      });
    }

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found.",
      });
    }

    const newComment = await Comment.create({
      comment,
      user: req.user._id,
      blog: blogId,
    });

    const populatedComment = await Comment.findById(newComment._id)
      .populate("user", "name profileImage");

    res.status(201).json({
      success: true,
      message: "Comment added successfully.",
      comment: populatedComment,
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
// Get Comments of a Blog
// ======================================

export const getCommentsByBlog = async (req, res) => {
  try {
    const { blogId } = req.params;

    const comments = await Comment.find({ blog: blogId })
      .populate("user", "name profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: comments.length,
      comments,
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
// Update Comment
// ======================================

export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    const existingComment = await Comment.findById(id);

    if (!existingComment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found.",
      });
    }

    if (
      existingComment.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    existingComment.comment = comment;

    await existingComment.save();
     await existingComment.populate("user", "name profileImage");

    res.status(200).json({
      success: true,
      message: "Comment updated successfully.",
      comment: existingComment,
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
// Delete Comment
// ======================================

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found.",
      });
    }

    if (
      comment.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    await Comment.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};