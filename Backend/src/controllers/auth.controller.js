import asyncHandler from "../utils/AsyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";

import { sendWelcomeEmail } from "../utils/mail.js";

import jwt from "jsonwebtoken";

import {
  sendOTPService,
  verifyOTPService,
  resendOTPService,
  loginOrRegisterConsumer,
  registerRetailer,
  verifyEmail,
  approvedRetailerService,
  BusinessUser,
  createStaff,
  forgotPassword,
  resetPassword,
  getProfileService,
} from "../services/auth.service.js";

import { getCookieOptions } from "../utils/cookieOptions.js";

/* ================= OTP ================= */

// 📱 Send OTP
export const sendOTP = asyncHandler(async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    throw new ApiError(400, "Phone number is required");
  }

  if (!/^[6-9]\d{9}$/.test(phone)) {
    throw new ApiError(400, "Invalid phone number");
  }

  await sendOTPService(phone);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "OTP sent successfully"));
});

// ✅ Verify OTP + Login/Register
export const verifyOTP = asyncHandler(async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    throw new ApiError(400, "Phone and OTP are required");
  }

  if (!/^[6-9]\d{9}$/.test(phone)) {
    throw new ApiError(400, "Invalid phone number");
  }

  if (!/^\d{6}$/.test(otp)) {
    throw new ApiError(400, "Invalid OTP format");
  }

  // 🔐 Verify OTP
  await verifyOTPService(phone, otp);

  // 👤 Login / Register
  const data = await loginOrRegisterConsumer(phone);

  res.cookie("refreshToken", data.refreshToken, getCookieOptions());

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      },
      "Login successful",
    ),
  );
});

// 🔁 Resend OTP
export const resendOTP = asyncHandler(async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    throw new ApiError(400, "Phone number is required");
  }

  if (!/^[6-9]\d{9}$/.test(phone)) {
    throw new ApiError(400, "Invalid phone number");
  }

  await resendOTPService(phone);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "OTP resent successfully"));
});

/* ================= BUSINESS AUTH ================= */

// 🏪 Register Retailer
export const registerRetailerController = asyncHandler(async (req, res) => {
  const user = await registerRetailer(req.body);

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        email: user.email,
        userId: user._id,
      },
      "Verification email sent",
    ),
  );
});

// 👨‍💼 Create Staff
export const createStaffController = asyncHandler(async (req, res) => {
  const adminId = req.user?.userId;

  const { email, password, name } = req.body;

  if (!adminId) {
    throw new ApiError(401, "Unauthorized");
  }

  if (!email || !password || !name) {
    throw new ApiError(400, "All fields are required");
  }

  const staff = await createStaff(adminId, {
    email,
    password,
    name,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        _id: staff._id,
        email: staff.email,
        name: staff.name,
        role: staff.role,
      },
      "Staff created successfully",
    ),
  );
});

// 📧 Verify Email
export const VerifyEmailController = asyncHandler(async (req, res) => {
  const { token } = req.params;

  if (!token) {
    throw new ApiError(400, "Token is required");
  }

  const user = await verifyEmail(token);

  const accessToken = generateAccessToken(user);

  const refreshToken = generateRefreshToken(user);

  const shopUrl = process.env.CLIENT_URL;

  await sendWelcomeEmail(user.email, user.name, shopUrl);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        email: user.email,
        UserId: user._id,
        accessToken,
        refreshToken,
      },
      "Email verified successfully",
    ),
  );
});

// ✅ Approve Retailer
export const approveRetailerController = asyncHandler(async (req, res) => {
  const retailer = await approvedRetailerService(
    req.user.userId,
    req.params.id,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, retailer, "Retailer approved successfully"));
});

// 🔐 Business Login
export const loginBusinessUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password required");
  }

  const data = await BusinessUser(email, password);

  res.cookie("refreshToken", data.refreshToken, getCookieOptions());

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: data.user,
        accessToken: data.accessToken,
      },
      "Login successful",
    ),
  );
});

// 🔑 Forgot Password
export const forgotPasswordController = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email required");
  }

  const data = await forgotPassword(email);

  return res.status(200).json(new ApiResponse(200, null, data.message));
});

// 🔄 Reset Password
export const resetPasswordController = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const { password } = req.body;

  if (!token || !password) {
    throw new ApiError(400, "Token and password required");
  }

  const data = await resetPassword(token, password);

  return res.status(200).json(new ApiResponse(200, null, data.message));
});

/* ================= COMMON ================= */

// 📄 Get Profile
export const getProfile = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const user = await getProfileService(userId);

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Profile fetched successfully"));
});

// ✏️ Update Profile
export const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;

  const { name, email, gender, occupation, dob, altPhone } = req.body;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  // Name validation
  if (name && name.trim().length < 2) {
    throw new ApiError(400, "Valid name required");
  }

  // Alternate phone validation
  if (altPhone && !/^[6-9]\d{9}$/.test(altPhone)) {
    throw new ApiError(400, "Invalid alternate phone");
  }

  const updateData = {
    name,
    email,
    gender,
    occupation,
    dob,
    altPhone,
  };

  // remove undefined values
  Object.keys(updateData).forEach((key) => {
    if (updateData[key] === undefined) {
      delete updateData[key];
    }
  });

  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Profile updated successfully"));
});

// 🔁 Refresh Access Token
export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.headers["x-refresh-token"];

  if (!token) {
    return res
      .status(401)
      .json(new ApiResponse(401, null, "No active session"));
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    throw new ApiError(401, "Invalid/expired refresh token");
  }

  const user = await User.findById(decoded.userId);

  if (!user) {
    throw new ApiError(401, "User not found");
  }

  if (decoded.tokenVersion !== user.tokenVersion) {
    throw new ApiError(401, "Session expired. Please login again");
  }

  const newAccessToken = generateAccessToken(user);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        accessToken: newAccessToken,
      },
      "Token refreshed",
    ),
  );
});

// 🚪 Logout
export const logout = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  await User.findByIdAndUpdate(userId, {
    $inc: {
      tokenVersion: 1,
    },
  });

  res.clearCookie("refreshToken", getCookieOptions());

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Logged out successfully"));
});
