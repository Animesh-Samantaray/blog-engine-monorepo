import User from "../models/User.model.js";
import bcrypt from "bcrypt";
import createToken from "../utils/createToken.js";
import {sendEmail} from "../utils/sendEmail.js";
import otpTemplate from "../utils/otpTemplate.js";
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


export const forgotPassword = async (req, res) => {
  try {

    let { email } = req.body;
    email = email.trim().toLowerCase();
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (user?.googleId) {
    return res.status(400).json({
        success: false,
        message: "Password reset is not available for Google accounts. Please login using Google."
    });
}

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOTP = await bcrypt.hash(otp, 10);
    user.resetOTP = hashedOTP;
    user.resetOTPExpire = Date.now() + 10 * 60 * 1000;
    user.isOTPVerified = false;
    await user.save();

    await sendEmail(
      user.email,
      "Password Reset OTP",
      otpTemplate(otp)
    );

    res.status(200).json({
      success: true,
      message: "OTP sent successfully.",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

export const verifyOTP = async (req, res) => {
  try {

    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (!user.resetOTPExpire || user.resetOTPExpire < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired.",
      });
    }
    if (!user.resetOTP) {
    return res.status(400).json({
        success: false,
        message: "Please request a new OTP."
    });
}

    const isMatched = await bcrypt.compare(
      otp,
      user.resetOTP
    );

    if (!isMatched) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    user.isOTPVerified = true;
    await user.save();
    res.status(200).json({
      success: true,
      message: "OTP verified successfully.",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

export const resetPassword = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }
        if (user.googleId) {
    return res.status(400).json({
        success: false,
        message: "Password reset is not available for Google accounts."
    });
}

        if (!user.isOTPVerified) {
            return res.status(400).json({
                success: false,
                message: "OTP verification required.",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;

        user.resetOTP = "";

        user.resetOTPExpire = null;

        user.isOTPVerified = false;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password reset successfully.",
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });

    }
};