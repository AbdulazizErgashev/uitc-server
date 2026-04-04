// src/modules/companies/companies.routes.js
import express from "express";
import {
  getCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
} from "./companies.controller.js";

import { authMiddleware } from "../../middlewares/auth.js";
import { adminMiddleware } from "../../middlewares/role.js";
import { validate } from "../../middlewares/validate.js";
import {
  createCompanySchema,
  updateCompanySchema,
  idParamSchema,
} from "../../validators/companies.validator.js";
import { upload } from "../../utils/multer.js"; // memoryStorage bilan fayl upload

const router = express.Router();

// Barcha route-larga admin check qo‘yiladi
router.use(authMiddleware, adminMiddleware);

// CRUD routes
router.get("/", getCompanies);
router.get("/:id", validate(idParamSchema, "params"), getCompany);

// CREATE
router.post(
  "/",
  upload.single("logo"), // fayl upload
  validate(createCompanySchema), // body validation
  createCompany,
);

// UPDATE
router.patch(
  "/:id",
  upload.single("logo"),
  validate(idParamSchema, "params"),
  validate(updateCompanySchema),
  updateCompany,
);

// DELETE
router.delete("/:id", validate(idParamSchema, "params"), deleteCompany);

export default router;
