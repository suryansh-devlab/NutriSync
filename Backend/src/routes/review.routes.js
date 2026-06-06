import express from "express";

import verifyAccessToken from "../middleware/auth.middleware.js";

import {
  addReview,
  getProductReviews,
  updateReview,
  deleteReview,
} from "../controllers/review.controller.js";

const router = express.Router();

// Add Review
router.post("/:productId", verifyAccessToken, addReview);

// Get Product Reviews
router.get("/product/:productId", getProductReviews);

// Update Review
router.put("/:reviewId", verifyAccessToken, updateReview);

// Delete Review
router.delete("/:reviewId", verifyAccessToken, deleteReview);

export default router;
