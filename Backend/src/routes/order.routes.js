import express from "express";
import verifyAccessToken from "../middleware/auth.middleware.js";
import {
  placeOrder,
  getSingleOrder,
  updateOrderStatus,
  cancelOrder,
  getMyOrders,
} from "../controllers/order.controller.js";
import authorizeRoles from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/place", verifyAccessToken, placeOrder);
router.get("/my-orders", verifyAccessToken, getMyOrders);
router.get("/:id", verifyAccessToken, getSingleOrder);
router.put(
  "/:id/status",
  verifyAccessToken,
  authorizeRoles("admin", "staff"),
  updateOrderStatus,
);
router.delete("/:id/cancel", verifyAccessToken, cancelOrder);

export default router;
