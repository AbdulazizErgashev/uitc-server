import express from "express";
import {
  getPortfolios,
  getPortfolio,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
} from "./portfolio.controller.js";
import { authMiddleware } from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validate.js";
import {
  createPortfolioSchema,
  updatePortfolioSchema,
  idParamSchema,
} from "../../validators/portfolio.validator.js";

const router = express.Router();

router.get("/", getPortfolios);
router.get("/:id", validate(idParamSchema, "params"), getPortfolio);

router.use(authMiddleware);

router.post("/", validate(createPortfolioSchema), createPortfolio);
router.patch("/:id", validate(idParamSchema, "params"), validate(updatePortfolioSchema), updatePortfolio);
router.delete("/:id", validate(idParamSchema, "params"), deletePortfolio);

export default router;
