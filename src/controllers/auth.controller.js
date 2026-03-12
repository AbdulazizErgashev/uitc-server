import { asyncHandler } from "../utils/asyncHandler.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";
import {
  registerAdmin,
  loginAdmin,
  getAdminMe,
  updateAdmin,
} from "../services/auth.service.js";

// Register
export const register = asyncHandler(async (req, res) => {
  try {
    const result = await registerAdmin(req.body);
    successResponse(res, result, "Admin registered successfully");
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
});

// Login
export const login = asyncHandler(async (req, res) => {
  try {
    const result = await loginAdmin(req.body);
    successResponse(res, result, "Logged in successfully");
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
});

// Me
export const me = asyncHandler(async (req, res) => {
  try {
    const admin = await getAdminMe(req.user.id);
    successResponse(res, admin, "Admin fetched successfully");
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
});

// Update
export const update = asyncHandler(async (req, res) => {
  try {
    const updated = await updateAdmin(req.user.id, req.body);
    successResponse(res, updated, "Admin updated successfully");
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
});

// Logout
export const logout = asyncHandler(async (req, res) => {
  // JWT stateless, shuning uchun serverda tokenni o'chirish shart emas
  // Frontend tokenni localStorage yoki cookie-dan o'chiradi
  successResponse(res, null, "Logged out successfully");
});
