import asyncHandler from "../utils/AsyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  placeOrderService,
  getMyOrdersService,
  getSingleOrderService,
  updateOrderStatusService,
  cancelOrderService,
} from "../services/order.service.js";

// Place Order
export const placeOrder = asyncHandler(async (req, res) => {
  const order = await placeOrderService(req.user.userId);

  return res
    .status(201)
    .json(new ApiResponse(201, order, "Order placed successfully"));
});

// Get My Orders
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await getMyOrdersService(req.user.userId);

  return res
    .status(200)
    .json(new ApiResponse(200, orders, "Orders fetched successfully"));
});

// Get Single Order
export const getSingleOrder = asyncHandler(async (req, res) => {
  const order = await getSingleOrderService(req.params.id, req.user.userId);

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order fetched successfully"));
});

// Update Order Status
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderStatus } = req.body;

  const order = await updateOrderStatusService(req.params.id, orderStatus);

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order status updated"));
});

// Cancel Order
export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await cancelOrderService(req.params.id, req.user.userId);

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order cancelled successfully"));
});
