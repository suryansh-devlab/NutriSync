import { Address } from "../models/address.model.js";
import ApiError from "../utils/ApiError.js";
import { Order } from "../models/order.model.js";

// Create Address
export const createAddressService = async (userId, addressData) => {
  const {
    fullName,
    phone,
    addressLine1,
    addressLine2,
    city,
    state,
    postalCode,
    country,
    landmark,
    tag,
    isDefault,
  } = addressData;

  // Required field validation
  if (!fullName || !phone || !addressLine1 || !city || !state || !postalCode) {
    throw new ApiError(400, "All required fields are required");
  }

  // Phone validation
  if (!/^[0-9]{10}$/.test(phone)) {
    throw new ApiError(400, "Invalid phone number");
  }

  // Postal code validation
  if (!/^[0-9]{6}$/.test(postalCode)) {
    throw new ApiError(400, "Invalid postal code");
  }

  // Address tag validation
  const validTags = ["home", "office", "parents_home", "other"];

  if (tag && !validTags.includes(tag)) {
    throw new ApiError(400, "Invalid address tag");
  }

  // Max 5 addresses allowed
  const existingAddresses = await Address.countDocuments({
    user: userId,
  });

  if (existingAddresses >= 5) {
    throw new ApiError(400, "Maximum 5 addresses allowed");
  }

  // First address becomes default
  const isFirstAddress = existingAddresses === 0;

  // If setting default address
  if (isDefault) {
    await Address.updateMany({ user: userId }, { isDefault: false });
  }

  // Create address
  const address = await Address.create({
    user: userId,

    fullName,
    phone,

    addressLine1,
    addressLine2: addressLine2 || "",

    city,
    state,
    postalCode,

    country: country || "India",

    landmark: landmark || "",

    tag: tag || "home",

    isDefault: isDefault || isFirstAddress,
  });

  return address;
};

// Get All Addresses
export const getAddressesService = async (userId) => {
  const addresses = await Address.find({
    user: userId,
  }).sort({
    isDefault: -1,
    createdAt: -1,
  });

  return addresses;
};

// Get Single Address
export const getSingleAddressService = async (userId, addressId) => {
  const address = await Address.findOne({
    _id: addressId,
    user: userId,
  });

  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  return address;
};

export const updateAddressService = async (userId, addressId, updateData) => {
  const address = await Address.findOne({
    _id: addressId,
    user: userId,
  });

  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  // Prevent updating address linked to shipped/delivered orders
  const activeOrder = await Order.findOne({
    user: userId,

    "shippingAddress.addressId": addressId,

    orderStatus: {
      $in: ["shipped", "delivered"],
    },
  });

  if (activeOrder) {
    throw new ApiError(
      400,
      "Cannot update address linked to shipped or delivered orders",
    );
  }

  // Phone validation
  if (updateData.phone && !/^[0-9]{10}$/.test(updateData.phone)) {
    throw new ApiError(400, "Invalid phone number");
  }

  // Postal code validation
  if (updateData.postalCode && !/^[0-9]{6}$/.test(updateData.postalCode)) {
    throw new ApiError(400, "Invalid postal code");
  }

  // Address tag validation
  const validTags = ["home", "office", "parents_home", "other"];

  if (updateData.tag && !validTags.includes(updateData.tag)) {
    throw new ApiError(400, "Invalid address tag");
  }

  // Handle default address
  if (updateData.isDefault) {
    await Address.updateMany({ user: userId }, { isDefault: false });
  }

  // Update fields
  Object.assign(address, updateData);

  await address.save();

  return address;
};

// Delete Address
export const deleteAddressService = async (userId, addressId) => {
  const address = await Address.findOne({
    _id: addressId,
    user: userId,
  });

  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  await address.deleteOne();

  // If deleted address was default
  if (address.isDefault) {
    const anotherAddress = await Address.findOne({
      user: userId,
    });

    if (anotherAddress) {
      anotherAddress.isDefault = true;

      await anotherAddress.save();
    }
  }

  return {
    message: "Address deleted successfully",
  };
};

// Set Default Address
export const setDefaultAddressService = async (userId, addressId) => {
  const address = await Address.findOne({
    _id: addressId,
    user: userId,
  });

  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  // Remove old default
  await Address.updateMany({ user: userId }, { isDefault: false });

  // Set new default
  address.isDefault = true;

  await address.save();

  return address;
};
