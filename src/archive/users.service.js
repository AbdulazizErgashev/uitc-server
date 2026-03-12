// import { prisma } from "../../prisma/prisma.js";
// import bcrypt from "bcrypt";
// import { AppError } from "../utils/AppError.js";

// // Get all users
// export const getAllUsersService = async () => {
//   return await prisma.user.findMany({
//     select: {
//       id: true,
//       full_name: true,
//       email: true,
//       role: true,
//       created_at: true,
//     },
//     orderBy: { created_at: "desc" },
//   });
// };

// // Get single user
// export const getUserByIdService = async (id) => {
//   const user = await prisma.user.findUnique({
//     where: { id },
//     select: {
//       id: true,
//       full_name: true,
//       email: true,
//       role: true,
//       created_at: true,
//     },
//   });

//   if (!user) throw new AppError("User not found", 404);
//   return user;
// };

// // Update user
// export const updateUserService = async (id, body) => {
//   const user = await prisma.user.findUnique({ where: { id } });
//   if (!user) throw new AppError("User not found", 404);

//   const data = {};
//   if (body.full_name) data.full_name = body.full_name;
//   if (body.email) data.email = body.email;
//   if (body.role) data.role = body.role;
//   if (body.password) data.password = await bcrypt.hash(body.password, 10);

//   return await prisma.user.update({
//     where: { id },
//     data,
//     select: {
//       id: true,
//       full_name: true,
//       email: true,
//       role: true,
//       created_at: true,
//     },
//   });
// };

// // Delete user
// export const deleteUserService = async (id) => {
//   const user = await prisma.user.findUnique({ where: { id } });
//   if (!user) throw new AppError("User not found", 404);

//   await prisma.user.delete({ where: { id } });
//   return true;
// };
