import asyncHandler from "../utils/AsyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  addToCartService,
  getCartService,
  updateCartItemService,
  removeCartItemService,
  clearCartService,
} from "../services/cart.service.js";

// Add to cart
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  const cart = await addToCartService(req.user.userId, productId, quantity);

  return res.status(200).json(new ApiResponse(200, cart, "Item added to cart"));
});

// Get cart
export const getCart = asyncHandler(async (req, res) => {
  const cart = await getCartService(req.user.userId);

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Cart fetched successfully"));
});

// Update cart item quantity
export const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;

  const cart = await updateCartItemService(
    req.user.userId,
    req.params.productId,
    quantity,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Cart updated successfully"));
});

// Remove cart item
export const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await removeCartItemService(
    req.user.userId,
    req.params.productId,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Item removed from cart"));
});

// Clear cart
export const clearCart = asyncHandler(async (req, res) => {
  const cart = await clearCartService(req.user.userId);

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Cart cleared successfully"));
});
