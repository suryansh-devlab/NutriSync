import asyncHandler from "../utils/AsyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  createAddressService,
  getAddressesService,
  getSingleAddressService,
  updateAddressService,
  deleteAddressService,
  setDefaultAddressService,
} from "../services/address.service.js";

// Create Address
export const createAddress = asyncHandler(async (req, res) => {
  const address = await createAddressService(req.user.userId, req.body);

  return res
    .status(201)
    .json(new ApiResponse(201, address, "Address created successfully"));
});

// Get All Addresses
export const getAddresses = asyncHandler(async (req, res) => {
  const addresses = await getAddressesService(req.user.userId);

  return res
    .status(200)
    .json(new ApiResponse(200, addresses, "Addresses fetched successfully"));
});

// Get Single Address
export const getSingleAddress = asyncHandler(async (req, res) => {
  const address = await getSingleAddressService(
    req.user.userId,
    req.params.addressId,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, address, "Address fetched successfully"));
});

// Update Address
export const updateAddress = asyncHandler(async (req, res) => {
  const address = await updateAddressService(
    req.user.userId,
    req.params.addressId,
    req.body,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, address, "Address updated successfully"));
});

// Delete Address
export const deleteAddress = asyncHandler(async (req, res) => {
  const response = await deleteAddressService(
    req.user.userId,
    req.params.addressId,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, response, "Address deleted successfully"));
});

// Set Default Address
export const setDefaultAddress = asyncHandler(async (req, res) => {
  const address = await setDefaultAddressService(
    req.user.userId,
    req.params.addressId,
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, address, "Default address updated successfully"),
    );
});
