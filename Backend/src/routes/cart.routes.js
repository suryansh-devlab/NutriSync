import express from "express";

import verifyAccessToken from "../middleware/auth.middleware.js";

import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.post("/add", verifyAccessToken, addToCart);

router.get("/", verifyAccessToken, getCart);

router.put("/update/:productId", verifyAccessToken, updateCartItem);

router.delete("/remove/:productId", verifyAccessToken, removeCartItem);

router.delete("/clear", verifyAccessToken, clearCart);

export default router;
