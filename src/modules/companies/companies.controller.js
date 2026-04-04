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

  const fileName = `companies/${Date.now()}-${req.file.originalname}`;
  const { url } = await uploadToLocal(req.file.buffer, fileName);

  const data = { ...req.body, logo_url: url };
  const company = await createCompanyService(data);

  successResponse(res, company, "Company created successfully");
});

// UPDATE company
export const updateCompany = asyncHandler(async (req, res) => {
  let data = { ...req.body };

  if (req.file) {
    const fileName = `companies/${Date.now()}-${req.file.originalname}`;
    const { url } = await uploadToLocal(req.file.buffer, fileName);
    data.logo_url = url;
  }

  const company = await updateCompanyService(req.params.id, data);
  successResponse(res, company, "Company updated successfully");
});

// DELETE company
export const deleteCompany = asyncHandler(async (req, res) => {
  await deleteCompanyService(req.params.id);
  successResponse(res, null, "Company deleted successfully");
});
