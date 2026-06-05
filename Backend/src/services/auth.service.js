import redisClient from "../config/redis.js";
import generateOTP from "../utils/otp.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import {
  generateVerificationToken,
  generateAccessToken,
  generateRefreshToken,
  generateResetPasswordToken,
} from "../utils/jwt.js";
import { sendVerificationEmail } from "../utils/mail.js";
import crypto from "crypto";

/* ================= OTP ================= */

export const sendOTPService = async (phone) => {
  const isLimited = await redisClient.get(`otp_limit:${phone}`);
  if (isLimited) throw new ApiError(429, "Wait before retry");

  const otp = generateOTP();

  await redisClient.set(`otp:${phone}`, otp, "EX", 30);
  await redisClient.set(`otp_limit:${phone}`, "sent", "EX", 30);

  console.log("OTP:", otp);

  return true;
};

export const resendOTPService = async (phone) => {
  const isLimited = await redisClient.get(`otp_limit:${phone}`);

  if (isLimited) {
    throw new ApiError(429, "Please wait before 30 sec requesting again");
  }
  const otp = generateOTP();

  await redisClient.set(`otp:${phone}`, otp, "EX", 30);
  await redisClient.set(`otp_limit:${phone}`, "sent", "EX", 30);

  console.log("Resend otp:", otp);

  return true;
};

export const verifyOTPService = async (phone, otp) => {
  // Demo Mode for testing without waiting for OTP expiry
  if (process.env.DEMO_MODE === "true" && otp === process.env.DEMO_OTP) {
    await redisClient.del(`otp:${phone}`);
    return true;
  }
  const stored = await redisClient.get(`otp:${phone}`);

  if (!stored) throw new ApiError(400, "OTP expired");
  if (stored !== otp) throw new ApiError(400, "Invalid OTP");

  await redisClient.del(`otp:${phone}`);

  return true;
};

/* ================= CONSUMER ================= */

export const loginOrRegisterConsumer = async (phone) => {
  let user = await User.findOne({ phone });

  if (!user) {
    user = await User.create({
      phone,
      role: ["consumer"],
      authProvider: "otp",
      isOTPVerified: true,
    });
  } else {
    user.isOTPVerified = true;
    await user.save();
  }

  return {
    user,
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user),
  };
};

/* ================= RETAILER ================= */

export const registerRetailer = async (data) => {
  // console.log("Received data:", data);

  const { email, password, name, shopName } = data;

  const existing = await User.findOne({ email });

  if (existing && existing.isEmailVerified) {
    throw new ApiError(400, "Email already registered");
  }

  const user =
    existing ||
    (await User.create({
      email,
      password,
      name,
      shopName,
      role: ["retailer"],
      authProvider: "local",
    }));

  const { unHashedToken, hashedToken, tokenExpiry } =
    generateVerificationToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;

  await user.save();

  const verifyURL = `${process.env.CLIENT_URL}/verify-email/${unHashedToken}`;

  await sendVerificationEmail(user.email, user.name, verifyURL);

  return user;
};

export const verifyEmail = async (token) => {
  const hashed = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    emailVerificationToken: hashed,
    emailVerificationExpiry: { $gt: Date.now() },
  });

  if (!user) throw new ApiError(400, "Invalid/expired token");

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpiry = undefined;

  await user.save();

  return user;
};

export const approvedRetailerService = async (userId, retailerId) => {
  const user = await User.findById(userId);

  const canApprove =
    user && (user.role.includes("admin") || user.role.includes("staff"));

  if (!canApprove) {
    throw new ApiError(403, "Only admin or staff can approve retailers");
  }

  const retailer = await User.findById(retailerId);

  if (!retailer || !retailer.role.includes("retailer")) {
    throw new ApiError(404, "Retailer not found");
  }

  retailer.isApproved = true;

  await retailer.save();

  return retailer;
};
export const BusinessUser = async (email, password) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) throw new ApiError(401, "Not found");

  const isBusinessUser =
    user.role.includes("retailer") ||
    user.role.includes("admin") ||
    user.role.includes("staff");

  if (!isBusinessUser) {
    throw new ApiError(401, "Access denied");
  }
  if (!user.isActive) {
    throw new ApiError(403, "Account disabled by admin");
  }
  if (user.role.includes("retailer") && !user.isApproved) {
    throw new ApiError(401, "Not approved yet");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new ApiError(401, "Invalid credentials");

  return {
    user,
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user),
  };
};

export const createStaff = async (adminId, data) => {
  const admin = await User.findById(adminId);

  if (!admin || !admin.role.includes("admin")) {
    throw new ApiError(403, "Only admin can create staff");
  }

  const existing = await User.findOne({ email: data.email });
  if (existing) {
    throw new ApiError(400, "Email already exists");
  }

  const staff = await User.create({
    email: data.email,
    password: data.password,
    name: data.name,
    role: ["staff"],
    authProvider: "local",

    isApproved: true,

    createdBy: admin._id,
  });

  return staff;
};

/* ================= FORGOT PASSWORD ================= */

export const forgotPassword = async (email) => {
  const user = await User.findOne({ email });

  const isBusinessUser =
    user &&
    (user.role.includes("retailer") ||
      user.role.includes("admin") ||
      user.role.includes("staff"));

  if (!isBusinessUser) {
    throw new ApiError(404, "User not found");
  }
  if (user.authProvider !== "local") {
    throw new ApiError(400, "Password reset not allowed");
  }
  const { unHashedToken, hashedToken, tokenExpiry } =
    generateResetPasswordToken();

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpiry = tokenExpiry;

  await user.save();

  const resetURL = `${process.env.CLIENT_URL}/reset-password/${unHashedToken}`;

  await sendVerificationEmail(user.email, user.name, resetURL);

  return { message: "Reset link sent" };
};

export const resetPassword = async (token, newPassword) => {
  const hashed = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashed,
    resetPasswordExpiry: { $gt: Date.now() },
  }).select("+password");

  if (!user) throw new ApiError(400, "Invalid/expired token");

  user.tokenVersion += 1;

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiry = undefined;

  await user.save();

  return { message: "Password reset successful" };
};

export const getProfileService = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
};
