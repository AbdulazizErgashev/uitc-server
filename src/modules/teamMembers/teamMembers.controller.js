// src/modules/teamMembers/teamMembers.controller.js
import { asyncHandler } from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import {
  getAllTeamMembers,
  getTeamMemberById,
  createTeamMemberService,
  updateTeamMemberService,
  deleteTeamMemberService,
} from "./teamMembers.service.js";
import { uploadToLocal } from "../../utils/uploadLocal.js"; // AWS o‘rniga local

// GET all team members
export const getTeamMembers = asyncHandler(async (req, res) => {
  const members = await getAllTeamMembers();
  successResponse(res, members, "Team members fetched successfully");
});

// GET single team member
export const getTeamMember = asyncHandler(async (req, res) => {
  const member = await getTeamMemberById(req.params.id);
  successResponse(res, member, "Team member fetched successfully");
});

// CREATE team member
export const createTeamMember = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "Image file is required" });
  }
  const fileName = `team-members/${Date.now()}-${req.file.originalname}`;
  const { url } = await uploadToLocal(req.file.buffer, fileName);

  const data = { ...req.body, image: url };
  const member = await createTeamMemberService(data);
  successResponse(res, member, "Team member created successfully");
});

// UPDATE team member
export const updateTeamMember = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "Image file is required" });
  }
  const fileName = `team-members/${Date.now()}-${req.file.originalname}`;
  const { url } = await uploadToLocal(req.file.buffer, fileName);

  const data = { ...req.body, image: url };
  const member = await updateTeamMemberService(req.params.id, data);
  successResponse(res, member, "Team member updated successfully");
});

// DELETE team member
export const deleteTeamMember = asyncHandler(async (req, res) => {
  await deleteTeamMemberService(req.params.id);
  successResponse(res, null, "Team member deleted successfully");
});
