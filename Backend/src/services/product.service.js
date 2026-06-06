import { Product } from "../models/product.model.js";
import ApiError from "../utils/ApiError.js";

// Create Product
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

  if (!title || !description || !category || !price) {
    throw new ApiError(400, "Missing required fields");
  }

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

// Get All Products With Filters
export const getAllProductsService = async (query) => {
  const {
    search,
    category,
    vegan,
    minPrice,
    maxPrice,
    minProtein,
    sort,
    page = 1,
    limit = 10,
  } = query;

  // Dynamic query object
  const filter = {};

  // Search
  if (search) {
    filter.title = {
      $regex: search,
      $options: "i",
    };
  }

  // Category filter
  if (category) {
    filter.category = category;
  }

  // Vegan filter
  if (vegan === "true") {
    filter.vegan = true;
  }

  // Price filter
  if (minPrice || maxPrice) {
    filter.price = {};

    if (minPrice) {
      filter.price.$gte = Number(minPrice);
    }

    if (maxPrice) {
      filter.price.$lte = Number(maxPrice);
    }
  }

  // Protein filter
  if (minProtein) {
    filter.protein = {
      $gte: Number(minProtein),
    };
  }

  // Sorting
  let sortOption = {};

  if (sort === "price_asc") {
    sortOption.price = 1;
  } else if (sort === "price_desc") {
    sortOption.price = -1;
  } else if (sort === "latest") {
    sortOption.createdAt = -1;
  } else {
    sortOption.createdAt = -1;
  }

  // Pagination
  const skip = (Number(page) - 1) * Number(limit);

  // Fetch products
  const products = await Product.find(filter)
    .sort(sortOption)
    .skip(skip)
    .limit(Number(limit));

  // Total count
  const totalProducts = await Product.countDocuments(filter);

  return {
    products,

    totalProducts,

    currentPage: Number(page),

    totalPages: Math.ceil(totalProducts / Number(limit)),
  };
};

// Get Single Product
export const getSingleProductService = async (productId) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return product;
};

// Update Product
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

// Delete Product
export const deleteProductService = async (productId) => {
  const deletedProduct = await Product.findByIdAndDelete(productId);

  if (!deletedProduct) {
    throw new ApiError(404, "Product not found");
  }

  return deletedProduct;
};
