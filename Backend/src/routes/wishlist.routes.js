import express from "express";

import verifyAccessToken from "../middleware/auth.middleware.js";

import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../controllers/wishlist.controller.js";

const router = express.Router();

// Add To Wishlist
router.post("/:productId", verifyAccessToken, addToWishlist);

// Get Wishlist
router.get("/", verifyAccessToken, getWishlist);

// Remove From Wishlist
router.delete("/:productId", verifyAccessToken, removeFromWishlist);

export default router;
