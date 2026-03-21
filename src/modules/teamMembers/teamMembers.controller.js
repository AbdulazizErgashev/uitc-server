import { asyncHandler } from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import {
  getAllTeamMembers,
  getTeamMemberById,
  createTeamMemberService,
  updateTeamMemberService,
  deleteTeamMemberService,
} from "./teamMembers.service.js";

export const getTeamMembers = asyncHandler(async (req, res) => {
  const members = await getAllTeamMembers();
  successResponse(res, members, "Team members fetched successfully");
});

export const getTeamMember = asyncHandler(async (req, res) => {
  const member = await getTeamMemberById(req.params.id);
  successResponse(res, member, "Team member fetched successfully");
});

export const createTeamMember = asyncHandler(async (req, res) => {
  const member = await createTeamMemberService(req.body);
  successResponse(res, member, "Team member created successfully");
});

export const updateTeamMember = asyncHandler(async (req, res) => {
  const member = await updateTeamMemberService(req.params.id, req.body);
  successResponse(res, member, "Team member updated successfully");
});

export const deleteTeamMember = asyncHandler(async (req, res) => {
  await deleteTeamMemberService(req.params.id);
  successResponse(res, null, "Team member deleted successfully");
});