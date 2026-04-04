import { asyncHandler } from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import {
  getAllCompanies,
  getCompanyById,
  createCompanyService,
  updateCompanyService,
  deleteCompanyService,
} from "./companies.service.js";
import { uploadToS3 } from "../../utils/s3.js";

export const getCompanies = asyncHandler(async (req, res) => {
  const companies = await getAllCompanies();
  successResponse(res, companies, "Companies fetched successfully");
});

export const getCompany = asyncHandler(async (req, res) => {
  const company = await getCompanyById(req.params.id);
  successResponse(res, company, "Company fetched successfully");
});

export const createCompany = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Logo file is required" });
  }
  const fileName = `companies/${Date.now()}-${req.file.originalname}`;
  const { url } = await uploadToS3(req.file.buffer, fileName, req.file.mimetype);
  const data = { ...req.body, logo_url: url };
  const company = await createCompanyService(data);
  successResponse(res, company, "Company created successfully");
});

export const updateCompany = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Logo file is required" });
  }
  const fileName = `companies/${Date.now()}-${req.file.originalname}`;
  const { url } = await uploadToS3(req.file.buffer, fileName, req.file.mimetype);
  const data = { ...req.body, logo_url: url };
  const company = await updateCompanyService(req.params.id, data);
  successResponse(res, company, "Company updated successfully");
});

export const deleteCompany = asyncHandler(async (req, res) => {
  await deleteCompanyService(req.params.id);
  successResponse(res, null, "Company deleted successfully");
});
