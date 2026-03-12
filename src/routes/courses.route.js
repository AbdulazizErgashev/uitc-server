import express from "express";

import {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/courses.controller.js";

import { authMiddleware } from "../middlewares/auth.js";
import { adminMiddleware } from "../middlewares/role.js";
import { validate } from "../middlewares/validate.js";

import {
  createCourseSchema,
  updateCourseSchema,
  idParamSchema,
} from "../validators/courses.validator.js";

const router = express.Router();

// Public
router.get("/", getCourses);
router.get("/:id", validate(idParamSchema, "params"), getCourse);

// Admin only
router.use(authMiddleware, adminMiddleware);

router.post("/", validate(createCourseSchema), createCourse);

router.patch(
  "/:id",
  validate(idParamSchema, "params"),
  validate(updateCourseSchema),
  updateCourse,
);

router.delete("/:id", validate(idParamSchema, "params"), deleteCourse);

export default router;
