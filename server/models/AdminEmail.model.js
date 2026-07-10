import mongoose from "mongoose";

const adminEmailSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    createdBy: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const AdminEmail = mongoose.model("AdminEmail", adminEmailSchema);
export default AdminEmail;
