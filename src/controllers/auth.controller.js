// controllers/auth.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";
import { registerUser, loginUser, getMe } from "../services/auth.service.js";

// Register
export const register = asyncHandler(async (req, res) => {
  try {
    const result = await registerUser(req.body);
    successResponse(res, result, "User registered successfully");
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
});

// Login
export const login = asyncHandler(async (req, res) => {
  try {
    const result = await loginUser(req.body);
    successResponse(res, result, "Logged in successfully");
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
});

// Me
export const me = asyncHandler(async (req, res) => {
  try {
    const user = await getMe(req.user.id);
    successResponse(res, user, "User fetched successfully");
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
});
