import { asyncHandler } from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import {
  getAllPortfolios,
  getPortfolioById,
  createPortfolioService,
  updatePortfolioService,
  deletePortfolioService,
} from "./portfolio.service.js";

export const getPortfolios = asyncHandler(async (req, res) => {
  const portfolios = await getAllPortfolios();
  return successResponse(res, { count: portfolios.length, portfolios }, "Portfolios fetched successfully");
});

export const getPortfolio = asyncHandler(async (req, res) => {
  const portfolio = await getPortfolioById(req.params.id);
  return successResponse(res, portfolio, "Portfolio fetched successfully");
});

export const createPortfolio = asyncHandler(async (req, res) => {
  const portfolio = await createPortfolioService(req.body);
  return successResponse(res, portfolio, "Portfolio created successfully");
});

export const updatePortfolio = asyncHandler(async (req, res) => {
  const portfolio = await updatePortfolioService(req.params.id, req.body);
  return successResponse(res, portfolio, "Portfolio updated successfully");
});

export const deletePortfolio = asyncHandler(async (req, res) => {
  await deletePortfolioService(req.params.id);
  return successResponse(res, null, "Portfolio deleted successfully");
});
