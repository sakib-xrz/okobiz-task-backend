const jwt = require("jsonwebtoken");

const ApiError = require("../error/ApiError.js");
const { config } = require("../config/config.js");

const User = require("../models/user.model.js");

const authGuard = (...requiredRoles) => {
  return async (req, _res, next) => {
    try {
      // Get token from request headers, ensuring 'Authorization' is present
      const bearerToken = req.headers.authorization;
      if (!bearerToken || !bearerToken.startsWith("Bearer ")) {
        throw new ApiError(401, "Invalid or missing authorization header");
      }

      // Extract token from bearer token
      const token = bearerToken.split(" ")[1]; // Fix: Handle cases with extra spaces

      const secret = config.jwtSecret;

      // Verify token
      const decoded = jwt.verify(token, secret);
      const user = await User.findById(decoded._id);

      if (!user || user.status !== "ACTIVE") {
        throw new ApiError(
          401,
          "Unauthorize: You are not authorized to access this resource"
        );
      }

      if (requiredRoles.length && !requiredRoles.includes(user.role)) {
        throw new ApiError(
          403,
          "Forbidden: You are not allowed to access this resource"
        );
      }

      req.user = {
        _id: user._id.toString(),
        email: user.email,
        role: user.role,
      };

      next();
    } catch (error) {
      next(error); // Pass error to error handling middleware
    }
  };
};

module.exports = authGuard;
