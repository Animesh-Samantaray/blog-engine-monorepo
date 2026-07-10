import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },
    video: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      enum: [
        "Technology",
        "Sports",
        "Art",
        "Education",
        "Travel",
        "Food",
        "Lifestyle",
        "Other",
      ],
      default: "Other",
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
