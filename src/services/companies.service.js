import { prisma } from "../../prisma/prisma.js";
import { AppError } from "../utils/AppError.js";

// Get all companies
export const getAllCompanies = async () => {
  return await prisma.company.findMany();
};

// Get single company
export const getCompanyById = async (id) => {
  const company = await prisma.company.findUnique({ where: { id } });
  if (!company) throw new AppError("Company not found", 404);
  return company;
};

// Create company
export const createCompanyService = async (data) => {
  return await prisma.company.create({ data });
};

// Update company
export const updateCompanyService = async (id, data) => {
  const exists = await prisma.company.findUnique({ where: { id } });
  if (!exists) throw new AppError("Company not found", 404);
  return await prisma.company.update({ where: { id }, data });
};

// Delete company
export const deleteCompanyService = async (id) => {
  const exists = await prisma.company.findUnique({ where: { id } });
  if (!exists) throw new AppError("Company not found", 404);
  return await prisma.company.delete({ where: { id } });
};
