import { prisma } from "../../../prisma/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

export const registerAdmin = async ({ full_name, phone, password }) => {
  const existing = await prisma.user.findUnique({ where: { phone } });
  if (existing) throw new Error("Phone already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.create({
    data: {
      full_name,
      phone: phone, // email field used as phone
      password: hashedPassword,
      role: "admin",
    },
  });

  const token = jwt.sign({ id: admin.id, role: admin.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return { admin: { id: admin.id, full_name, phone, role: admin.role }, token };
};

export const loginAdmin = async ({ phone, password }) => {
  const admin = await prisma.user.findUnique({ where: { phone } });
  if (!admin || admin.role !== "admin") throw new Error("Invalid credentials");

  const match = await bcrypt.compare(password, admin.password);
  if (!match) throw new Error("Invalid credentials");

  const token = jwt.sign({ id: admin.id, role: admin.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return {
    admin: {
      id: admin.id,
      full_name: admin.full_name,
      phone,
      role: admin.role,
    },
    token,
  };
};

export const updateAdmin = async (adminId, data) => {
  const existingAdmin = await prisma.user.findUnique({
    where: { id: adminId },
  });
  if (!existingAdmin || existingAdmin.role !== "admin")
    throw new Error("Admin not found");

  const updateData = {};
  if (data.phone) updateData.phone = data.phone; // using email field as phone
  if (data.password) updateData.password = await bcrypt.hash(data.password, 10);

  const updated = await prisma.user.update({
    where: { id: adminId },
    data: updateData,
    select: { id: true, full_name: true, phone: true },
  });

  return { admin: updated };
};

export const getAdminMe = async (adminId) => {
  const admin = await prisma.user.findUnique({ where: { id: adminId } });
  if (!admin || admin.role !== "admin") throw new Error("Admin not found");

  return {
    id: admin.id,
    full_name: admin.full_name,
    phone: admin.email,
    role: admin.role,
  };
};
