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
import { validate } from "../middlewares/validate.js";

import {
  createCompanySchema,
  updateCompanySchema,
  idParamSchema,
} from "../validators/companies.validator.js";

const router = express.Router();

// Admin-only routes
router.use(authMiddleware, adminMiddleware);

// GET all companies
router.get("/", getCompanies);

// GET single company
router.get("/:id", validate(idParamSchema, "params"), getCompany);

// CREATE company
router.post("/", validate(createCompanySchema), createCompany);

// UPDATE company
router.patch(
  "/:id",
  validate(idParamSchema, "params"),
  validate(updateCompanySchema),
  updateCompany,
);

// DELETE company
router.delete("/:id", validate(idParamSchema, "params"), deleteCompany);

export default router;
