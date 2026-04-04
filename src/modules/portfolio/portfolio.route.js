import express from "express";
import {
  getPortfolios,
  getPortfolio,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
  getPortfolioStats,
} from "./portfolio.controller.js";
import { authMiddleware } from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validate.js";
import {
  createPortfolioSchema,
  updatePortfolioSchema,
  idParamSchema,
} from "../../validators/portfolio.validator.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", getPortfolios);
router.get("/:id", validate(idParamSchema, "params"), getPortfolio);

// Admin routes
router.use(authMiddleware);

router.post(
  "/",
  upload.single("media"),
  validate(createPortfolioSchema),
  createPortfolio,
);

router.patch(
  "/:id",
  upload.single("media"),
  validate(idParamSchema, "params"),
  validate(updatePortfolioSchema),
  updatePortfolio,
);

router.delete("/:id", validate(idParamSchema, "params"), deletePortfolio);

// DASHBOARD stats
router.get("/stats", getPortfolioStats);

export default router;
