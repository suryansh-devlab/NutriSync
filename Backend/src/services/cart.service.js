import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import ApiError from "../utils/ApiError.js";

// Add to Cart
export const addToCartService = async (userId, productId, quantity) => {
  // Find product
  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Validate stock
  if (quantity > product.stock) {
    throw new ApiError(400, "Requested quantity exceeds stock");
  }

  // Find user's cart
  let cart = await Cart.findOne({
    user: userId,
  });

  // Create cart if not exists
  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [],
    });
  }

  // Check if product already exists
  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId,
  );

  if (existingItem) {
    existingItem.quantity += quantity;

    // Check stock again
    if (existingItem.quantity > product.stock) {
      throw new ApiError(400, "Requested quantity exceeds stock");
    }
  } else {
    cart.items.push({
      product: product._id,
      quantity,
      price: product.price,
    });
  }

  // Recalculate totals
  cart.totalPrice = cart.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  cart.totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);

  await cart.save();

  return cart;
};

// Get Cart
export const getCartService = async (userId) => {
  const cart = await Cart.findOne({
    user: userId,
  }).populate("items.product");

  if (!cart) {
    return {
      items: [],
      totalPrice: 0,
      totalItems: 0,
    };
  }

  return cart;
};

// Update Cart Item Quantity
export const updateCartItemService = async (userId, productId, quantity) => {
  const cart = await Cart.findOne({
    user: userId,
  });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  const item = cart.items.find((item) => item.product.toString() === productId);

  if (!item) {
    throw new ApiError(404, "Item not found in cart");
  }

  // Find product
  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Validate stock
  if (quantity > product.stock) {
    throw new ApiError(400, "Requested quantity exceeds stock");
  }

  item.quantity = quantity;

  // Recalculate totals
  cart.totalPrice = cart.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  cart.totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);

  await cart.save();

  return cart;
};

// Remove Item From Cart
export const removeCartItemService = async (userId, productId) => {
  const cart = await Cart.findOne({
    user: userId,
  });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId,
  );

  // Recalculate totals
  cart.totalPrice = cart.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  cart.totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);

  await cart.save();

  return cart;
};

// Clear Cart
export const clearCartService = async (userId) => {
  await Cart.findOneAndDelete({
    user: userId,
  });

  return {
    items: [],
    totalPrice: 0,
    totalItems: 0,
  };
};
