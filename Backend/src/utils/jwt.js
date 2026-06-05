import jwt from "jsonwebtoken";
import crypto from "crypto";

// REFRESH TOKEN
export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      role: user.role,
      type: "auth",
      tokenVersion: user.tokenVersion,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY },
  );
};

// ACCESS TOKEN
export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      role: user.role,
      tokenVersion: user.tokenVersion,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
  );
};

// ✉️ VERIFICATION TOKEN
export const generateVerificationToken = (user) => {
  const unHashedToken = crypto.randomBytes(20).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(unHashedToken)
    .digest("hex");

  const tokenExpiry = Date.now() + 20 * 60 * 1000; // 20min

  console.log("RAW TOKEN:", unHashedToken);
  // console.log("HASHED TOKEN:", hashedToken);
  return { unHashedToken, hashedToken, tokenExpiry };
};

export const generateResetPasswordToken = (user) => {
  const unHashedToken = crypto.randomBytes(20).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(unHashedToken)
    .digest("hex");

  const tokenExpiry = Date.now() + 20 * 60 * 1000; // 20min

  console.log("RAW TOKEN:", unHashedToken);
  // console.log("HASHED TOKEN:", hashedToken);
  return { unHashedToken, hashedToken, tokenExpiry };
};
