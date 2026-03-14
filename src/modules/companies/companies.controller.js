import { asyncHandler } from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import {
  getAllCompanies,
  getCompanyById,
  createCompanyService,
  updateCompanyService,
  deleteCompanyService,
} from "./companies.service.js";

export const getCompanies = asyncHandler(async (req, res) => {
  const companies = await getAllCompanies();
  successResponse(res, companies, "Companies fetched successfully");
});

export const getCompany = asyncHandler(async (req, res) => {
  const company = await getCompanyById(req.params.id);
  successResponse(res, company, "Company fetched successfully");
});

export const createCompany = asyncHandler(async (req, res) => {
  const company = await createCompanyService(req.body);
  successResponse(res, company, "Company created successfully");
});

export const updateCompany = asyncHandler(async (req, res) => {
  const company = await updateCompanyService(req.params.id, req.body);
  successResponse(res, company, "Company updated successfully");
});

export const deleteCompany = asyncHandler(async (req, res) => {
  await deleteCompanyService(req.params.id);
  successResponse(res, null, "Company deleted successfully");
});
