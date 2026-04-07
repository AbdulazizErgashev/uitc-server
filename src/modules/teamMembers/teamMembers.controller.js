import { asyncHandler } from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import {
  getAllTeamMembers,
  getTeamMemberById,
  createTeamMemberService,
  updateTeamMemberService,
  deleteTeamMemberService,
} from "./teamMembers.service.js";

/**
 * JSON parse helper: expertise & achievements
 */
const parseJSONFields = (body) => {
  ["expertise", "achievements"].forEach((field) => {
    if (body[field] && typeof body[field] === "string") {
      try {
        body[field] = JSON.parse(body[field]);
      } catch {
        body[field] = [];
      }
    }
  });
};

// GET all
export const getTeamMembers = asyncHandler(async (req, res) => {
  const members = await getAllTeamMembers();
  successResponse(res, members, "Team members fetched successfully");
});

// GET one
export const getTeamMember = asyncHandler(async (req, res) => {
  const member = await getTeamMemberById(req.params.id);
  successResponse(res, member, "Team member fetched successfully");
});

// CREATE
export const createTeamMember = asyncHandler(async (req, res) => {
  parseJSONFields(req.body);

  const member = await createTeamMemberService(req.body, req.file);

  successResponse(res, member, "Team member created successfully");
});

// UPDATE
export const updateTeamMember = asyncHandler(async (req, res) => {
  parseJSONFields(req.body);

  const member = await updateTeamMemberService(
    req.params.id,
    req.body,
    req.file,
  );

  successResponse(res, member, "Team member updated successfully");
});

// DELETE
export const deleteTeamMember = asyncHandler(async (req, res) => {
  await deleteTeamMemberService(req.params.id);
  res.status(204).send();
});
