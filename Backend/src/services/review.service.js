import { Review } from "../models/review.model.js";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";

import ApiError from "../utils/ApiError.js";

// Update Product Ratings
const updateProductRatings = async (productId) => {
  const reviews = await Review.find({
    product: productId,
  });

  const totalReviews = reviews.length;

  const averageRating =
    totalReviews === 0
      ? 0
      : reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews;

  await Product.findByIdAndUpdate(productId, {
    averageRating: Number(averageRating.toFixed(1)),

    totalReviews,
  });
};

// Add Review
export const addReviewService = async (userId, productId, reviewData) => {
  const { rating, comment } = reviewData;

  // Validate rating
  if (!rating || rating < 1 || rating > 5) {
    throw new ApiError(400, "Rating must be between 1 and 5");
  }

  // Product exists
  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Delivered order check
  const deliveredOrder = await Order.findOne({
    user: userId,

    orderStatus: "delivered",

    "items.product": productId,
  });

  if (!deliveredOrder) {
    throw new ApiError(400, "You can review only delivered purchased products");
  }

  // Prevent duplicate reviews
  const existingReview = await Review.findOne({
    user: userId,
    product: productId,
  });

  if (existingReview) {
    throw new ApiError(400, "You already reviewed this product");
  }

  // Create review
  const review = await Review.create({
    user: userId,
    product: productId,
    rating,
    comment,
  });

  // Update ratings
  await updateProductRatings(productId);

  return review;
};

// Get Product Reviews
export const getProductReviewsService = async (productId) => {
  const reviews = await Review.find({
    product: productId,
  })
    .populate("user", "name")
    .sort({
      createdAt: -1,
    });

  return reviews;
};

// Update Review
export const updateReviewService = async (userId, reviewId, updateData) => {
  const review = await Review.findById(reviewId);

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  // Ownership check
  if (review.user.toString() !== userId.toString()) {
    throw new ApiError(403, "Access denied");
  }

  // Rating validation
  if (updateData.rating && (updateData.rating < 1 || updateData.rating > 5)) {
    throw new ApiError(400, "Rating must be between 1 and 5");
  }

  // Update fields
  Object.assign(review, updateData);

  await review.save();

  // Recalculate ratings
  await updateProductRatings(review.product);

  return review;
};

// Delete Review
export const deleteReviewService = async (userId, reviewId) => {
  const review = await Review.findById(reviewId);

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  // Ownership check
  if (review.user.toString() !== userId.toString()) {
    throw new ApiError(403, "Access denied");
  }

  const productId = review.product;

  await review.deleteOne();

  // Recalculate ratings
  await updateProductRatings(productId);

  return {
    message: "Review deleted successfully",
  };
};
