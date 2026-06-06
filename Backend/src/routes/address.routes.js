import express from "express";

import verifyAccessToken from "../middleware/auth.middleware.js";

import {
  createAddress,
  getAddresses,
  getSingleAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controllers/address.controller.js";

const router = express.Router();

// Create Address
router.post("/", verifyAccessToken, createAddress);

// Get All Addresses
router.get("/", verifyAccessToken, getAddresses);

// Get Single Address
router.get("/:addressId", verifyAccessToken, getSingleAddress);

// Update Address
router.put("/:addressId", verifyAccessToken, updateAddress);

// Delete Address
router.delete("/:addressId", verifyAccessToken, deleteAddress);

// Set Default Address
router.patch("/:addressId/default", verifyAccessToken, setDefaultAddress);

export default router;
