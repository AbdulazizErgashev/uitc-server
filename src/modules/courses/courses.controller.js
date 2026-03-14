import { asyncHandler } from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import {
  getAllCourses,
  getCourseById,
  createCourseService,
  updateCourseService,
  deleteCourseService,
} from "./courses.service.js";

export const getCourses = asyncHandler(async (req, res) => {
  const courses = await getAllCourses();
  successResponse(res, courses, "Courses fetched successfully");
});

export const getCourse = asyncHandler(async (req, res) => {
  const course = await getCourseById(req.params.id);
  successResponse(res, course, "Course fetched successfully");
});

export const createCourse = asyncHandler(async (req, res) => {
  const course = await createCourseService(req.body);
  successResponse(res, course, "Course created successfully");
});

export const updateCourse = asyncHandler(async (req, res) => {
  const course = await updateCourseService(req.params.id, req.body);
  successResponse(res, course, "Course updated successfully");
});

export const deleteCourse = asyncHandler(async (req, res) => {
  await deleteCourseService(req.params.id);
  successResponse(res, null, "Course deleted successfully");
});
