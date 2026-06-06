import asyncHandler from "../utils/AsyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  addReviewService,
  getProductReviewsService,
  updateReviewService,
  deleteReviewService,
} from "../services/review.service.js";

// Add Review
export const addReview = asyncHandler(async (req, res) => {
  const review = await addReviewService(
    req.user.userId,
    req.params.productId,
    req.body,
  );

  return res
    .status(201)
    .json(new ApiResponse(201, review, "Review added successfully"));
});

// Get Product Reviews
export const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await getProductReviewsService(req.params.productId);

  return res
    .status(200)
    .json(new ApiResponse(200, reviews, "Reviews fetched successfully"));
});

// Update Review
export const updateReview = asyncHandler(async (req, res) => {
  const review = await updateReviewService(
    req.user.userId,
    req.params.reviewId,
    req.body,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, review, "Review updated successfully"));
});

// Delete Review
export const deleteReview = asyncHandler(async (req, res) => {
  const response = await deleteReviewService(
    req.user.userId,
    req.params.reviewId,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, response, "Review deleted successfully"));
});
