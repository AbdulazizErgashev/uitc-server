import { prisma } from "../../prisma/prisma.js";
import bcrypt from "bcrypt";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";

// Get all users
export const getUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      full_name: true,
      email: true,
      role: true,
      created_at: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  res.json({
    success: true,
    count: users.length,
    data: users,
  });
});

// Get single user
export const getUser = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      full_name: true,
      email: true,
      role: true,
      created_at: true,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.json({
    success: true,
    data: user,
  });
});

// Update user
export const updateUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { full_name, email, password, role } = req.body;

  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const data = {};

  if (full_name) data.full_name = full_name;
  if (email) data.email = email;
  if (role) data.role = role;

  if (password) {
    data.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      full_name: true,
      email: true,
      role: true,
      created_at: true,
    },
  });

  res.json({
    success: true,
    message: "User updated successfully",
    data: updatedUser,
  });
});

// Delete user
export const deleteUser = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  await prisma.user.delete({
    where: { id },
  });

  res.json({
    success: true,
    message: "User deleted successfully",
  });
});
