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

router.get("/", verifyAccessToken, getAllProducts);
router.get("/:id", verifyAccessToken, getSingleProduct);

export default router;
