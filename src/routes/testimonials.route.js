import express from "express";
import {
  getTestimonials,
  getTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  likeTestimonial,
  bookmarkTestimonial,
  addComment,
  getStats,
  getFeatured,
} from "../controllers/testimonials.controller.js";

import { authMiddleware } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import {
  createTestimonialSchema,
  updateTestimonialSchema,
  addCommentSchema,
} from "../validators/testimonials.validator.js";

const router = express.Router();

// Public endpoints
router.get("/", getTestimonials);
router.get("/featured", getFeatured);
router.get("/stats", getStats);
router.get("/:id", getTestimonial);

// Authenticated endpoints
router.use(authMiddleware);

router.post("/", validate(createTestimonialSchema), createTestimonial);
router.patch("/:id", validate(updateTestimonialSchema), updateTestimonial);
router.delete("/:id", deleteTestimonial);

router.post("/:id/like", likeTestimonial);
router.post("/:id/bookmark", bookmarkTestimonial);
router.post("/:id/comment", validate(addCommentSchema), addComment);

export default router;
