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
import multer from "multer";

const router = express.Router();
const upload = multer(); // memoryStorage bilan

// Admin faqatgina
router.use(authMiddleware, adminMiddleware);

// CRUD routes
router.get("/", getCompanies);
router.get("/:id", validate(idParamSchema, "params"), getCompany);
router.post(
  "/",
  upload.single("logo"),
  validate(createCompanySchema),
  createCompany,
);
router.patch(
  "/:id",
  upload.single("logo"),
  validate(idParamSchema, "params"),
  validate(updateCompanySchema),
  updateCompany,
);
router.delete("/:id", validate(idParamSchema, "params"), deleteCompany);

export default router;
