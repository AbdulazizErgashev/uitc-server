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
  getTrending,
  getTopRated,
  getByTag,
  shareTestimonial,
} from "./testimonials.controller.js";

import { authMiddleware } from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validate.js";
import {
  createTestimonialSchema,
  updateTestimonialSchema,
  addCommentSchema,
  idParamSchema,
} from "../../validators/testimonials.validator.js";
import multer from "multer";

const router = express.Router();
const upload = multer();

router.get("/", getTestimonials);
router.get("/featured", getFeatured);
router.get("/stats", getStats);
router.get("/trending", getTrending);
router.get("/top-rated", getTopRated);
router.get("/tag", getByTag);
router.get("/:id", validate(idParamSchema, "params"), getTestimonial);

router.use(authMiddleware);

router.post("/", upload.single("video"), validate(createTestimonialSchema), createTestimonial);
router.patch(
  "/:id",
  upload.single("video"),
  validate(idParamSchema, "params"),
  validate(updateTestimonialSchema),
  updateTestimonial,
);
router.delete("/:id", validate(idParamSchema, "params"), deleteTestimonial);
router.post("/:id/like", validate(idParamSchema, "params"), likeTestimonial);
router.post("/:id/bookmark", validate(idParamSchema, "params"), bookmarkTestimonial);
router.post("/:id/comment", validate(idParamSchema, "params"), validate(addCommentSchema), addComment);
router.post("/:id/share", validate(idParamSchema, "params"), shareTestimonial);

export default router;
