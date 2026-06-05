import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

const verifyAccessToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    // console.log("Token 🔍" + token);

    if (!token) {
      return next(new ApiError(401, "Unauthorized"));
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
      tokenVersion: decoded.tokenVersion,
    };
    next();
  } catch (err) {
    // jwt.verify throws if token is expired or invalid
    return next(new ApiError(401, "Invalid or expired token"));
  }
};

export default verifyAccessToken;
