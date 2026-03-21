import { prisma } from "../../../prisma/prisma.js";
import { AppError } from "../../utils/AppError.js";

export const getAllPortfolios = async () => {
  return await prisma.portfolio.findMany({ orderBy: { created_at: "desc" } });
};

export const getPortfolioById = async (id) => {
  const portfolio = await prisma.portfolio.findUnique({ where: { id } });
  if (!portfolio) throw new AppError("Portfolio item not found", 404);
  return portfolio;
};

export const createPortfolioService = async (data) => {
  return await prisma.portfolio.create({ data });
};

export const updatePortfolioService = async (id, data) => {
  const portfolio = await prisma.portfolio.findUnique({ where: { id } });
  if (!portfolio) throw new AppError("Portfolio item not found", 404);
  return await prisma.portfolio.update({ where: { id }, data });
};

export const deletePortfolioService = async (id) => {
  const portfolio = await prisma.portfolio.findUnique({ where: { id } });
  if (!portfolio) throw new AppError("Portfolio item not found", 404);
  await prisma.portfolio.delete({ where: { id } });
  return true;
};
