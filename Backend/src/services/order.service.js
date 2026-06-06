import { Order } from "../models/order.model.js";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import { Address } from "../models/address.model.js";
import ApiError from "../utils/ApiError.js";

// Place Order
export const placeOrderService = async (userId, addressId, paymentMethod) => {
  // Find user's cart
  const cart = await Cart.findOne({
    user: userId,
  }).populate("items.product");

  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, "Cart is empty");
  }

  // Find address
  const address = await Address.findOne({
    _id: addressId,
    user: userId,
  });

  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  // Validate stock
  for (const item of cart.items) {
    if (item.quantity > item.product.stock) {
      throw new ApiError(400, `${item.product.title} is out of stock`);
    }
  }

  // Create order items snapshot
  const orderItems = cart.items.map((item) => ({
    product: item.product._id,
    title: item.product.title,
    quantity: item.quantity,
    price: item.price,
    subtotal: item.price * item.quantity,
  }));

  // Create order
  const order = await Order.create({
    user: userId,
    items: orderItems,
    totalPrice: cart.totalPrice,
    paymentMethod: paymentMethod || "cod",

    shippingAddress: {
      addressId: address._id,

      fullName: address.fullName,

      phone: address.phone,

      addressLine1: address.addressLine1,

      addressLine2: address.addressLine2,

      city: address.city,

      state: address.state,

      postalCode: address.postalCode,

      country: address.country,

      landmark: address.landmark,

      tag: address.tag,
    },
  });

  // Reduce stock
  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product._id, {
      $inc: {
        stock: -item.quantity,
      },
    });
  }

  // Clear cart
  await Cart.findOneAndDelete({
    user: userId,
  });

  return order;
};

// Get My Orders
export const getMyOrdersService = async (userId) => {
  const orders = await Order.find({
    user: userId,
  }).sort({
    createdAt: -1,
  });

  return orders;
};

// Get Single Order
export const getSingleOrderService = async (orderId, userId) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // Prevent other users from accessing
  if (order.user.toString() !== userId.toString()) {
    throw new ApiError(403, "Access denied");
  }

  return order;
};

// Update Order Status
export const updateOrderStatusService = async (orderId, orderStatus) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // Valid statuses
  const validStatuses = [
    "pending",
    "confirmed",
    "shipped",
    "delivered",
    "cancelled",
  ];

  // Validate status
  if (!validStatuses.includes(orderStatus)) {
    throw new ApiError(400, "Invalid order status");
  }

  // Prevent changing delivered orders
  if (order.orderStatus === "delivered") {
    throw new ApiError(400, "Delivered order cannot be updated");
  }

  // Prevent cancelled order updates
  if (order.orderStatus === "cancelled") {
    throw new ApiError(400, "Cancelled order cannot be updated");
  }

  // Update status
  order.orderStatus = orderStatus;

  // Auto payment success when delivered
  if (orderStatus === "delivered" && order.paymentMethod === "cod") {
    order.paymentStatus = "paid";
  }

  await order.save();

  return order;
};

// Cancel Order
export const cancelOrderService = async (orderId, userId) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // Ownership check
  if (order.user.toString() !== userId.toString()) {
    throw new ApiError(403, "Access denied");
  }

  // Already delivered
  if (order.orderStatus === "delivered") {
    throw new ApiError(400, "Delivered order cannot be cancelled");
  }

  // Restore stock
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: {
        stock: item.quantity,
      },
    });
  }

  order.orderStatus = "cancelled";

  await order.save();

  return order;
};
