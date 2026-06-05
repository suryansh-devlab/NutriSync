import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import ApiError from "../utils/ApiError.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer_not_to_say"],
    },
    age: {
      type: Number,
    },
    dob: {
      type: Date,
    },

    altPhone: {
      type: String,
      trim: true,
    },

    occupation: {
      type: String,
      trim: true,
    },
    password: { type: String, select: false },
    role: {
      type: [String],
      enum: ["consumer", "retailer", "admin", "staff"],
      default: ["consumer"],
    },
    authProvider: {
      type: String,
      enum: ["otp", "local"],
      required: true,
    },
    isOTPVerified: {
      type: Boolean,
      default: false,
    },
    shopName: {
      type: String,
      trim: true,
      required: function () {
        return this.role.includes("retailer");
      },
    },
    emailVerificationToken: { type: String },
    emailVerificationExpiry: { type: Date },
    resetPasswordExpire: Date,
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpiry: Date,

    isApproved: {
      type: Boolean,
      default: function () {
        return this.role.includes("retailer") ? false : true;
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    approvedAt: {
      type: Date,
    },
    tokenVersion: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

//🔐 Validation
userSchema.pre("save", function () {
  const roles = this.role;

  // 🔹 Consumer (OTP)
  if (roles.includes("consumer")) {
    if (this.authProvider !== "otp") {
      throw new ApiError(401, "Consumer must use OTP auth");
    }

    if (!this.phone) {
      throw new ApiError(401, "Phone required for consumer");
    }
  }

  // 🔹 Email users (retailer/admin/staff)
  if (
    roles.includes("retailer") ||
    roles.includes("admin") ||
    roles.includes("staff")
  ) {
    if (this.authProvider !== "local") {
      throw new ApiError(401, "Email auth required");
    }

    if (!this.email) {
      throw new ApiError(401, "Email required");
    }
  }

  // 🔹 Retailer extra validation
  if (roles.includes("retailer")) {
    if (!this.name || !this.shopName) {
      return next(new Error("Retailer must have name and shopName"));
    }
  }
});
//🔐 Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
// 🔑 Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model("User", userSchema);
