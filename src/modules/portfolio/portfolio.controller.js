import { asyncHandler } from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import {
  getAllPortfolios,
  getPortfolioById,
  createPortfolioService,
  updatePortfolioService,
  deletePortfolioService,
} from "./portfolio.service.js";
import { uploadToLocal, deleteLocalFile } from "../../utils/uploadLocal.js";
import path from "path";

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
  let mediaUrl = null;
  if (req.file) {
    const fileName = `${Date.now()}-${req.file.originalname}`;
    const { url } = await uploadToLocal(req.file.buffer, fileName, "portfolio");
    mediaUrl = url;
  }

  const data = { ...req.body, media_url: mediaUrl };
  const portfolio = await createPortfolioService(data);
  return successResponse(res, portfolio, "Portfolio created successfully");
});

// UPDATE portfolio
export const updatePortfolio = asyncHandler(async (req, res) => {
  const portfolio = await getPortfolioById(req.params.id);
  let mediaUrl = null;

  if (req.file) {
    // eski faylni o'chirish
    if (portfolio.media_url) {
      const oldFilePath = path.join(process.cwd(), portfolio.media_url);
      await deleteLocalFile(oldFilePath);
    }

    const fileName = `${Date.now()}-${req.file.originalname}`;
    const { url } = await uploadToLocal(req.file.buffer, fileName, "portfolio");
    mediaUrl = url;
  }

  const data = { ...req.body, ...(mediaUrl && { media_url: mediaUrl }) };
  const updated = await updatePortfolioService(req.params.id, data);
  return successResponse(res, updated, "Portfolio updated successfully");
});

// DELETE portfolio
export const deletePortfolio = asyncHandler(async (req, res) => {
  const portfolio = await getPortfolioById(req.params.id);

  if (portfolio.media_url) {
    const filePath = path.join(process.cwd(), portfolio.media_url);
    await deleteLocalFile(filePath);
  }

  await deletePortfolioService(req.params.id);
  return successResponse(res, null, "Portfolio deleted successfully");
});

// DASHBOARD STATS
export const getPortfolioStats = asyncHandler(async (req, res) => {
  const totalPortfolios = await prisma.portfolio.count();
  return successResponse(
    res,
    { totalPortfolios },
    "Portfolio stats fetched successfully",
  );
});
