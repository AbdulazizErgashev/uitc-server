import { prisma } from "../../../prisma/prisma.js";
import { AppError } from "../../utils/AppError.js";

export const getAllCourses = async () => {
  return await prisma.course.findMany();
};

export const getCourseById = async (id) => {
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) throw new AppError("Course not found", 404);
  return course;
};

export const createCourseService = async (data) => {
  return await prisma.course.create({ data });
};

export const updateCourseService = async (id, data) => {
  const exists = await prisma.course.findUnique({ where: { id } });
  if (!exists) throw new AppError("Course not found", 404);
  return await prisma.course.update({ where: { id }, data });
};

export const deleteCourseService = async (id) => {
  const exists = await prisma.course.findUnique({ where: { id } });
  if (!exists) throw new AppError("Course not found", 404);
  return await prisma.course.delete({ where: { id } });
};
