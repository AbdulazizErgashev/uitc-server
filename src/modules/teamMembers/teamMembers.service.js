import { prisma } from "../../../prisma/prisma.js";
import { AppError } from "../../utils/AppError.js";
import { uploadToLocal } from "../../utils/uploadLocal.js";
import crypto from "crypto";

/**
 * Generate etag for caching
 */
const generateEtag = (data) =>
  crypto.createHash("md5").update(JSON.stringify(data)).digest("hex");

// GET all
export const getAllTeamMembers = async () => {
  return prisma.teamMember.findMany({
    orderBy: { created_at: "asc" },
  });
};

// GET one
export const getTeamMemberById = async (id) => {
  const member = await prisma.teamMember.findUnique({ where: { id } });
  if (!member) throw new AppError("Team member not found", 404);
  return member;
};

// CREATE
export const createTeamMemberService = async (body, file) => {
  let data = { ...body };

  if (file) {
    const folder = "team-members";
    const fileName = `${Date.now()}-${file.originalname}`;
    const { url } = await uploadToLocal(file.buffer, fileName, folder);
    data.image = url;
  }

  data.etag = generateEtag(data);

  return prisma.teamMember.create({ data });
};

// UPDATE
export const updateTeamMemberService = async (id, body, file) => {
  const exists = await prisma.teamMember.findUnique({ where: { id } });
  if (!exists) throw new AppError("Team member not found", 404);

  let data = { ...body };

  if (file) {
    const folder = "team-members";
    const fileName = `${Date.now()}-${file.originalname}`;
    const { url } = await uploadToLocal(file.buffer, fileName, folder);
    data.image = url;
  }

  data.etag = generateEtag({ ...exists, ...data });

  return prisma.teamMember.update({
    where: { id },
    data,
  });
};

// DELETE
export const deleteTeamMemberService = async (id) => {
  const exists = await prisma.teamMember.findUnique({ where: { id } });
  if (!exists) throw new AppError("Team member not found", 404);

  await prisma.teamMember.delete({ where: { id } });

  return true;
};
