import asyncHandler from "../utils/AsyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  addToWishlistService,
  getWishlistService,
  removeFromWishlistService,
} from "../services/wishlist.service.js";

// Add To Wishlist
export const addToWishlist = asyncHandler(async (req, res) => {
  const wishlist = await addToWishlistService(
    req.user.userId,
    req.params.productId,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, wishlist, "Product added to wishlist"));
});

// Get Wishlist
export const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await getWishlistService(req.user.userId);

  return res
    .status(200)
    .json(new ApiResponse(200, wishlist, "Wishlist fetched successfully"));
});

// Remove From Wishlist
export const removeFromWishlist = asyncHandler(async (req, res) => {
  const wishlist = await removeFromWishlistService(
    req.user.userId,
    req.params.productId,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, wishlist, "Product removed from wishlist"));
});
