import { prisma } from "../../../prisma/prisma.js";
import { AppError } from "../../utils/AppError.js";

// GET all portfolios
export const getAllPortfolios = async () => {
  return await prisma.portfolio.findMany({ orderBy: { created_at: "desc" } });
};

// GET single portfolio by ID
export const getPortfolioById = async (id) => {
  const portfolio = await prisma.portfolio.findUnique({ where: { id } });
  if (!portfolio) throw new AppError("Portfolio item not found", 404);
  return portfolio;
};

// CREATE portfolio
export const createPortfolioService = async (data) => {
  return await prisma.portfolio.create({ data });
};

// UPDATE portfolio
export const updatePortfolioService = async (id, data) => {
  const portfolio = await prisma.portfolio.findUnique({ where: { id } });
  if (!portfolio) throw new AppError("Portfolio item not found", 404);
  return await prisma.portfolio.update({ where: { id }, data });
};

// DELETE portfolio
export const deletePortfolioService = async (id) => {
  const portfolio = await prisma.portfolio.findUnique({ where: { id } });
  if (!portfolio) throw new AppError("Portfolio item not found", 404);
  await prisma.portfolio.delete({ where: { id } });
  return true;
};
