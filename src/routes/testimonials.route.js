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
} from "../controllers/testimonials.controller.js";

import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getTestimonials);
router.get("/:id", getTestimonial);

router.post("/", authMiddleware, createTestimonial);
router.patch("/:id", authMiddleware, updateTestimonial);
router.delete("/:id", authMiddleware, deleteTestimonial);

router.post("/:id/like", authMiddleware, likeTestimonial);
router.post("/:id/bookmark", authMiddleware, bookmarkTestimonial);
router.post("/:id/comment", authMiddleware, addComment);

export default router;
