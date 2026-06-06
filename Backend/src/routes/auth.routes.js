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
import authorizeRoles from "../middleware/role.middleware.js";

const router = express.Router();

// 📱 Consumer (OTP)
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);

// 🏪 Business
router.post("/register", registerRetailerController);
router.post(
  "/create-staff",
  verifyAccessToken,
  authorizeRoles("admin"),
  createStaffController,
);
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
router.post("/logout", verifyAccessToken, logout);
router.get("/profile", verifyAccessToken, getProfile);
router.patch("/profile-update", verifyAccessToken, updateProfile);

// Common
router.post("/refresh-token", refreshToken);

export default router;
