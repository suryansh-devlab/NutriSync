import express from "express";

import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
} from "../controllers/product.controller.js";

import authorizeRoles from "../middleware/role.middleware.js";
import verifyAccessToken from "../middleware/auth.middleware.js";

const router = express.Router();

// Public Routes
router.get("/", getAllProducts);

router.get("/:id", getSingleProduct);

// Admin / Staff Routes
router.post(
  "/",
  verifyAccessToken,
  authorizeRoles("admin", "staff"),
  createProduct,
);

router.put(
  "/:id",
  verifyAccessToken,
  authorizeRoles("admin", "staff"),
  updateProduct,
);

router.delete(
  "/:id",
  verifyAccessToken,
  authorizeRoles("admin", "staff"),
  deleteProduct,
);

export default router;
