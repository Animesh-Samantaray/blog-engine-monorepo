import User from "../models/User.model.js";
import bcrypt from "bcrypt";
import createToken from "../utils/createToken.js";

// =======================
// Register User
// =======================

export const registerUser = async (req, res) => {
  try {
    let {
      name,
      email,
      password,
      profileImage,
      bio,
      adminAccessToken,
    } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      });
    }

    name = name.trim();
    email = email.trim().toLowerCase();

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists. Please login.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Default role
    let role = "user";

    // Admin registration
    if (
      adminAccessToken &&
      adminAccessToken === process.env.ADMIN_ACCESS_TOKEN
    ) {
      role = "admin";
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profileImage,
      bio,
      role,
    });
const token = await createToken(user._id)
    res
  .cookie("token", token, {
    httpOnly: true,
    secure: false, // true in production with HTTPS
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  })
  .status(201)
  .json({
    success: true,
    message: "Registration successful.",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      bio: user.bio,
      role: user.role,
    },
  });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// =======================
// Login User
// =======================

export const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    email = email.trim().toLowerCase();

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: "This account is registered using Google OAuth. Please login with Google.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }
    const token = await createToken(user._id);
   res
  .cookie("token", token, {
    httpOnly: true,
    secure: false, // true in production with HTTPS
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  })
  .status(201)
  .json({
    success: true,
    message: "Login successful.",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      bio: user.bio,
      role: user.role,
    },
  });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// =======================
// Logout User
// =======================

export const logoutUser = async (req, res) => {
  try {
    
    if (!req.cookies || !req.cookies.token) {
      return res.status(401).json({ 
        success: false, 
        message: "No user found to log out." 
      });
    }

    res
      .clearCookie("token", {
        httpOnly: true,
        sameSite: "lax",
        secure: false, // In production, this should usually be true (requires HTTPS)
      })
      .status(200)
      .json({
        success: true,
        message: "Logged out successfully.",
      });
  } catch (error) {
    console.error("Logout Error: ", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};