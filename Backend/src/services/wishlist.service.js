import { Wishlist } from "../models/wishlist.model.js";
import { Product } from "../models/product.model.js";
import ApiError from "../utils/ApiError.js";

// Add to WishList
export const addToWishlistService = async (userId, productId) => {
  // check product exists

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // find wishlist
  let wishlist = await Wishlist.findOne({ user: userId });

  // Create Wishlist if not exists
  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: userId,
      products: [],
    });
  }

  // Prevent duplicates
  const alreadyExists = wishlist.products.some(
    (id) => id.toString() === productId,
  );

  if (alreadyExists) {
    throw new ApiError(400, "Product already in wishlist");
  }

  // Add Product
  wishlist.products.push(productId);

  await wishlist.save();

  return wishlist;
};

// Get Wishlist
export const getWishlistService = async (userId) => {
  const wishlist = await Wishlist.findOne({
    user: userId,
  }).populate("products");

  if (!wishlist) {
    return {
      products: [],
    };
  }

  return wishlist;
};

// Remove From Wishlist
export const removeFromWishlistService = async (userId, productId) => {
  const wishlist = await Wishlist.findOne({
    user: userId,
  });

  if (!wishlist) {
    throw new ApiError(404, "Wishlist not found");
  }

  wishlist.products = wishlist.products.filter(
    (id) => id.toString() !== productId,
  );

  await wishlist.save();

  return wishlist;
};
