import express from "express";
import verifyAccessToken from "../middleware/auth.middleware.js";
import {
  sendOTP,
  verifyOTP,
  resendOTP,
  logout,
  refreshToken,
  registerRetailerController,
  VerifyEmailController,
  approveRetailerController,
  createStaffController,
  loginBusinessUser,
  forgotPasswordController,
  resetPasswordController,
  getProfile,
  updateProfile,
} from "../controllers/auth.controller.js";

const router = express.Router();

// 📱 Consumer (OTP)
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);

// 🏪 Business
router.post("/register", registerRetailerController);
router.get("/verify-email/:token", VerifyEmailController);
router.patch(
  "/approve-retailer/:id",
  verifyAccessToken,
  approveRetailerController,
);
router.post("/login", loginBusinessUser);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password/:token", resetPasswordController);

// Protected
router.post("/staff", verifyAccessToken, createStaffController);
router.post("/logout", verifyAccessToken, logout);
router.get("/profile", verifyAccessToken, getProfile);
router.patch("/profile-update", verifyAccessToken, updateProfile);

// Common
router.post("/refresh-token", refreshToken);

export default router;
