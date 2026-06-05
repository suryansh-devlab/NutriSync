import mongoose from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "protein",
        "vegan",
        "snack",
        "vitamin",
        "supplement",
        "drink",
        "Dry Fruits",
      ],
    },
    brand: {
      type: String,
    },
    images: [
      {
        url: String,
        public_id: String,
      },
    ],
    price: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      default: 0,
    },
    protein: {
      type: Number,
      default: 0,
    },
    calories: {
      type: Number,
      default: 0,
    },
    vegan: {
      type: Boolean,
      default: false,
    },
    ingredients: [String],

    averageRating: {
      type: Number,
      default: 0,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

productSchema.pre("save", function () {
  if (this.title) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
    });
  }
});

export const Product = mongoose.model("Product", productSchema);
