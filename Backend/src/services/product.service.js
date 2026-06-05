import { Product } from "../models/product.model.js";
import ApiError from "../utils/ApiError.js";

export const createProductService = async (productData) => {
  const {
    title,
    description,
    category,
    price,
    stock,
    protein,
    calories,
    vegan,
    brand,
    ingredients,
    images,
  } = productData;

  // Validation

  if (!title || !description || !category || !price) {
    throw new ApiError(400, "Missing required fields");
  }

  // Create new product
  const product = await Product.create({
    title,
    description,
    category,
    price,
    stock: stock || 0,
    protein: protein || 0,
    calories: calories || 0,
    vegan: vegan || false,
    brand: brand || "",
    ingredients: ingredients || [],
    images: images || [],
  });
  return product;
};

// Get all products
export const getAllProductsService = async () => {
  const products = await Product.find();

  return products;
};

// Get product by ID
export const getSingleProductService = async (productId) => {
  const product = await Product.findById(productId);

  return product;
};

// Update product
export const updateProductService = async (productId, updateData) => {
  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    updateData,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedProduct) {
    throw new ApiError(404, "Product not found");
  }
  return updatedProduct;
};

// Delete product
export const deleteProductService = async (productId) => {
  const deletedProduct = await Product.findByIdAndDelete(productId);

  if (!deletedProduct) {
    throw new ApiError(404, "Product not found");
  }
  return deletedProduct;
};
