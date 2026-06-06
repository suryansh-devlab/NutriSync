import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    subtotal: {
      type: Number,
      required: true,
    },
  },
  { _id: false },
);

const shippingAddressSchema = new mongoose.Schema(
  {
    addressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },

    fullName: String,

    phone: String,

    addressLine1: String,

    addressLine2: String,

    city: String,

    state: String,

    postalCode: String,

    country: {
      type: String,
      default: "India",
    },

    landmark: String,

    tag: {
      type: String,
      enum: ["home", "office", "other"],
    },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [orderItemSchema],

    totalPrice: {
      type: Number,
      required: true,
    },

    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    paymentMethod: {
      type: String,
      enum: ["cod", "razorpay"],
      default: "cod",
    },

    shippingAddress: shippingAddressSchema,

    orderedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

export const Order = mongoose.model("Order", orderSchema);
