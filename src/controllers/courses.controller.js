import { asyncHandler } from "../utils/asyncHandler.js";
import { successResponse } from "../utils/apiResponse.js";
import {
  getAllCourses,
  getCourseById,
  createCourseService,
  updateCourseService,
  deleteCourseService,
} from "../services/courses.service.js";

// Get all courses
export const getCourses = asyncHandler(async (req, res) => {
  const courses = await getAllCourses();
  successResponse(res, courses, "Courses fetched successfully");
});

// Get single course
export const getCourse = asyncHandler(async (req, res) => {
  const course = await getCourseById(req.params.id);
  successResponse(res, course, "Course fetched successfully");
});

// Create course
export const createCourse = asyncHandler(async (req, res) => {
  const course = await createCourseService(req.body);
  successResponse(res, course, "Course created successfully");
});

// Update course
export const updateCourse = asyncHandler(async (req, res) => {
  const course = await updateCourseService(req.params.id, req.body);
  successResponse(res, course, "Course updated successfully");
});

// Delete course
export const deleteCourse = asyncHandler(async (req, res) => {
  await deleteCourseService(req.params.id);
  successResponse(res, null, "Course deleted successfully");
});
