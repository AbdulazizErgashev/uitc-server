import { asyncHandler } from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import {
  getAllUsersService,
  getUserByIdService,
  updateUserService,
  deleteUserService,
} from "./users.service.js";

export const getUsers = asyncHandler(async (req, res) => {
  const users = await getAllUsersService();
  successResponse(res, { count: users.length, users }, "Users fetched successfully");
});

export const getUser = asyncHandler(async (req, res) => {
  const user = await getUserByIdService(req.params.id);
  successResponse(res, user, "User fetched successfully");
});

export const updateUser = asyncHandler(async (req, res) => {
  const updatedUser = await updateUserService(req.params.id, req.body);
  successResponse(res, updatedUser, "User updated successfully");
});

export const deleteUser = asyncHandler(async (req, res) => {
  await deleteUserService(req.params.id);
  successResponse(res, null, "User deleted successfully");
});
