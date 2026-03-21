import { prisma } from "../../../prisma/prisma.js";
import { AppError } from "../../utils/AppError.js";

export const getAllTeamMembers = async () => {
  return await prisma.teamMember.findMany({ orderBy: { created_at: "asc" } });
};

export const getTeamMemberById = async (id) => {
  const member = await prisma.teamMember.findUnique({ where: { id } });
  if (!member) throw new AppError("Team member not found", 404);
  return member;
};

export const createTeamMemberService = async (data) => {
  return await prisma.teamMember.create({ data });
};

export const updateTeamMemberService = async (id, data) => {
  const exists = await prisma.teamMember.findUnique({ where: { id } });
  if (!exists) throw new AppError("Team member not found", 404);
  return await prisma.teamMember.update({ where: { id }, data });
};

export const deleteTeamMemberService = async (id) => {
  const exists = await prisma.teamMember.findUnique({ where: { id } });
  if (!exists) throw new AppError("Team member not found", 404);
  await prisma.teamMember.delete({ where: { id } });
  return true;
};