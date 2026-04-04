// src/modules/companies/companies.controller.js
import { asyncHandler } from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import {
  getAllCompanies,
  getCompanyById,
  createCompanyService,
  updateCompanyService,
  deleteCompanyService,
} from "./companies.service.js";
import { uploadToLocal } from "../../utils/uploadLocal.js";
import fs from "fs";
import path from "path";

// GET all companies
export const getCompanies = asyncHandler(async (req, res) => {
  const companies = await getAllCompanies();
  successResponse(res, companies, "Companies fetched successfully");
});

// GET single company
export const getCompany = asyncHandler(async (req, res) => {
  const company = await getCompanyById(req.params.id);
  successResponse(res, company, "Company fetched successfully");
});

// CREATE company
export const createCompany = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "Logo file is required" });
  }

  // Faylni images/companies papkaga saqlash
  const fileDir = path.join(process.cwd(), "images", "companies");
  if (!fs.existsSync(fileDir)) fs.mkdirSync(fileDir, { recursive: true });

  const fileName = `${Date.now()}-${req.file.originalname}`;
  const filePath = path.join(fileDir, fileName);

  await fs.promises.writeFile(filePath, req.file.buffer);

  const logo_url = `/images/companies/${fileName}`; // frontendda ishlatish uchun URL

  const data = { ...req.body, logo_url };
  const company = await createCompanyService(data);

  successResponse(res, company, "Company created successfully");
});

// UPDATE company
export const updateCompany = asyncHandler(async (req, res) => {
  let data = { ...req.body };

  if (req.file) {
    // Faylni images/companies papkaga saqlash
    const fileDir = path.join(process.cwd(), "images", "companies");
    if (!fs.existsSync(fileDir)) fs.mkdirSync(fileDir, { recursive: true });

    const fileName = `${Date.now()}-${req.file.originalname}`;
    const filePath = path.join(fileDir, fileName);

    await fs.promises.writeFile(filePath, req.file.buffer);
    data.logo_url = `/images/companies/${fileName}`;
  }

  const company = await updateCompanyService(req.params.id, data);
  successResponse(res, company, "Company updated successfully");
});

// DELETE company
export const deleteCompany = asyncHandler(async (req, res) => {
  await deleteCompanyService(req.params.id);
  successResponse(res, null, "Company deleted successfully");
});
