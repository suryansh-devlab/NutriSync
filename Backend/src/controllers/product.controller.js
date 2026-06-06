import asyncHandler from "../utils/AsyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  createProductService,
  getAllProductsService,
  getSingleProductService,
  updateProductService,
  deleteProductService,
} from "../services/product.service.js";

export const createProduct = asyncHandler(async (req, res) => {
  const product = await createProductService(req.body);

  return res
    .status(201)
    .json(new ApiResponse(201, product, "Product created successfully"));
});

export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await getAllProductsService(req.query);

  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products fetched successfully"));
});

export const getSingleProduct = asyncHandler(async (req, res) => {
  const product = await getSingleProductService(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product fetched successfully"));
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await updateProductService(req.params.id, req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product updated successfully"));
});

export const deleteProduct = asyncHandler(async (req, res) => {
  await deleteProductService(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Product deleted successfully"));
});
