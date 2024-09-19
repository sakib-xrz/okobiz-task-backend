const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const ApiError = require("../error/ApiError.js");
const { config } = require("../config/config.js");

const catchAsync = require("../utils/catchAsync.js");
const sendResponse = require("../utils/sendResponse.js");

const User = require("../models/user.model.js");

const register = catchAsync(async (req, res) => {
  const { ...registerData } = req.body;

  let { name, email, password } = registerData;

  if (!name || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const userAlreadyExists = await User.findOne({ email });

  if (userAlreadyExists) {
    throw new ApiError(400, "email already in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  password = hashedPassword;

  const newUser = await User.create({ name, email, password });

  const payload = {
    _id: newUser._id,
  };

  const secret = config.jwtSecret;
  const expiresIn = config.jwtExpiresIn;

  const token = jwt.sign(payload, secret, {
    expiresIn,
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Registration successful",
    data: {
      access: token,
    },
  });
});

const login = catchAsync(async (req, res) => {
  const { ...loginData } = req.body;

  const { email, password } = loginData;

  if (!email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(404, "No user found with this email");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new ApiError(401, "Incorrect email or password");
  }

  if (user.status === "BLOCK") {
    throw new ApiError(401, "Your account has been blocked");
  }

  const payload = {
    _id: user._id,
  };

  const secret = config.jwtSecret;
  const expiresIn = config.jwtExpiresIn;

  const token = jwt.sign(payload, secret, {
    expiresIn,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Login successful",
    data: {
      access: token,
    },
  });
});

const getMe = catchAsync(async (req, res) => {
  const user = req.user;

  const userData = await User.findById(user?._id);

  if (!userData) {
    throw new ApiError(404, "User not found");
  }

  if (userData.status === "BLOCK") {
    throw new ApiError(401, "Your account has been blocked");
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User details retrieved successfully",
    data: {
      user: userData,
    },
  });
});

const AuthController = {
  register,
  login,
  getMe,
};

module.exports = AuthController;
