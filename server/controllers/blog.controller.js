import Blog from "../models/Blog.model.js";

// ======================================
// Create Blog
// ======================================

export const createBlog = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    const image = req.file ? `/uploads/${req.file.filename}` : "";

    const blog = await Blog.create({
      title,
      content,
      category,
      image,
      author: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Blog created successfully.",
      blog,
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
      .populate("author", "name profileImage")
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
// Get Single Blog
// ======================================

export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "author",
      "name email profileImage bio"
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found.",
      });
    }

    res.status(200).json({
      success: true,
      blog,
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
// Update Blog
// ======================================

export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found.",
      });
    }

    if (
      blog.author.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const { title, content, category, isPublished } = req.body;

    if (title) blog.title = title;
    if (content) blog.content = content;
    if (category) blog.category = category;
    if (typeof isPublished !== "undefined")
      blog.isPublished = isPublished;

    if (req.file) {
      blog.image = `/uploads/${req.file.filename}`;
    }

    await blog.save();

    res.status(200).json({
      success: true,
      message: "Blog updated successfully.",
      blog,
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
// Delete Blog
// ======================================

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found.",
      });
    }

    if (
      blog.author.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    await Blog.findByIdAndDelete(req.params.id);

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
// Search Blogs
// ======================================

export const searchBlogs = async (req, res) => {
  try {
    const { search } = req.query;

    const blogs = await Blog.find({
      title: {
        $regex: search,
        $options: "i",
      },
    }).populate("author", "name");

    res.status(200).json({
      success: true,
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
// Get Blogs By Category
// ======================================

export const getBlogsByCategory = async (req, res) => {
  try {
    const blogs = await Blog.find({
      category: req.params.category,
    }).populate("author", "name");

    res.status(200).json({
      success: true,
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