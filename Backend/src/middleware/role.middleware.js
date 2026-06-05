import ApiError from "../utils/ApiError.js";

const authorizeRoles = (...allowedRoles) => {
  return (req, _, next) => {
    const userRoles = req.user.role;

    const hasPermission = userRoles.some((role) => allowedRoles.includes(role));

    if (!hasPermission) {
      return next(new ApiError(403, "Access denied"));
    }

    next();
  };
};

export default authorizeRoles;
