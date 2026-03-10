import express from "express";
import {
  getCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
} from "../controllers/companies.controller.js";
import { authMiddleware } from "../middlewares/auth.js";
import { adminMiddleware } from "../middlewares/role.js";

const router = express.Router();

router.use(authMiddleware, adminMiddleware);

router.get("/", getCompanies);
router.get("/:id", getCompany);
router.post("/", createCompany);
router.patch("/:id", updateCompany);
router.delete("/:id", deleteCompany);

export default router;