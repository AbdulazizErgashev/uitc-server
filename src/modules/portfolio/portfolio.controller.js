// src/modules/portfolio/portfolio.controller.js
import { asyncHandler } from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import {
  getAllPortfolios,
  getPortfolioById,
  createPortfolioService,
  updatePortfolioService,
  deletePortfolioService,
} from "./portfolio.service.js";
import { uploadToLocal } from "../../utils/uploadLocal.js"; // AWS o‘rniga local

// GET all portfolios
export const getPortfolios = asyncHandler(async (req, res) => {
  const portfolios = await getAllPortfolios();
  return successResponse(
    res,
    { count: portfolios.length, portfolios },
    "Portfolios fetched successfully",
  );
});

// GET single portfolio
export const getPortfolio = asyncHandler(async (req, res) => {
  const portfolio = await getPortfolioById(req.params.id);
  return successResponse(res, portfolio, "Portfolio fetched successfully");
});

// CREATE portfolio
export const createPortfolio = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "Media file is required" });
  }
  const fileName = `portfolio/${Date.now()}-${req.file.originalname}`;
  const { url } = await uploadToLocal(req.file.buffer, fileName);

  const data = { ...req.body, media_url: url };
  const portfolio = await createPortfolioService(data);
  return successResponse(res, portfolio, "Portfolio created successfully");
});

// UPDATE portfolio
export const updatePortfolio = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "Media file is required" });
  }
  const fileName = `portfolio/${Date.now()}-${req.file.originalname}`;
  const { url } = await uploadToLocal(req.file.buffer, fileName);

  const data = { ...req.body, media_url: url };
  const portfolio = await updatePortfolioService(req.params.id, data);
  return successResponse(res, portfolio, "Portfolio updated successfully");
});

// DELETE portfolio
export const deletePortfolio = asyncHandler(async (req, res) => {
  await deletePortfolioService(req.params.id);
  return successResponse(res, null, "Portfolio deleted successfully");
});
