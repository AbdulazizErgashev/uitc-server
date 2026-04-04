// src/modules/testimonials/testimonials.controller.js
import { asyncHandler } from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import { APIFeatures } from "../../utils/apiFeatures.js";
import { uploadToLocal } from "../../utils/uploadLocal.js"; // AWS S3 o‘rniga local
import {
  getTestimonialsService,
  getTestimonialByIdService,
  createTestimonialService,
  updateTestimonialService,
  deleteTestimonialService,
  likeTestimonialService,
  bookmarkTestimonialService,
  addCommentService,
  getStatsService,
  getFeaturedService,
  getTopRatedService,
  getByTagService,
  getTrendingService,
  shareTestimonialService,
} from "./testimonials.service.js";

// GET all testimonials
export const getTestimonials = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, company, course, year, search } = req.query;

  const filterObj = {};
  if (company) filterObj.company_id = company;
  if (course) filterObj.course_id = course;
  if (year) {
    const start = new Date(`${year}-01-01`);
    const end = new Date(`${Number(year) + 1}-01-01`);
    filterObj.date = { gte: start, lt: end };
  }
  if (search) {
    filterObj.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { quote: { contains: search, mode: "insensitive" } },
      { long_quote: { contains: search, mode: "insensitive" } },
    ];
  }

  const features = new APIFeatures(null, req.query).filter().sort().paginate();
  const data = await getTestimonialsService({
    filters: filterObj,
    queryOptions: features.queryOptions,
  });

  successResponse(res, data, "Testimonials fetched successfully");
});

// GET single testimonial
export const getTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await getTestimonialByIdService(req.params.id);
  successResponse(res, testimonial, "Testimonial fetched successfully");
});

// CREATE testimonial (local video upload)
export const createTestimonial = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "Video file is required" });
  }

  const fileName = `testimonials/${Date.now()}-${req.file.originalname}`;
  const { url } = await uploadToLocal(req.file.buffer, fileName);

  const testimonial = await createTestimonialService({
    ...req.body,
    user_id: req.user.id,
    date: new Date(),
    video_url: url,
  });

  successResponse(res, testimonial, "Testimonial created successfully");
});

// UPDATE testimonial (local video upload)
export const updateTestimonial = asyncHandler(async (req, res) => {
  let data = { ...req.body };

  if (req.file) {
    const fileName = `testimonials/${Date.now()}-${req.file.originalname}`;
    const { url } = await uploadToLocal(req.file.buffer, fileName);
    data.video_url = url;
  }

  const testimonial = await updateTestimonialService(req.params.id, data);
  successResponse(res, testimonial, "Testimonial updated successfully");
});

// DELETE testimonial
export const deleteTestimonial = asyncHandler(async (req, res) => {
  await deleteTestimonialService(req.params.id);
  successResponse(res, null, "Testimonial deleted successfully");
});

// LIKE testimonial
export const likeTestimonial = asyncHandler(async (req, res) => {
  await likeTestimonialService(req.params.id, req.user.id);
  successResponse(res, null, "Testimonial liked successfully");
});

// BOOKMARK testimonial
export const bookmarkTestimonial = asyncHandler(async (req, res) => {
  await bookmarkTestimonialService(req.params.id, req.user.id);
  successResponse(res, null, "Testimonial bookmarked successfully");
});

// ADD comment
export const addComment = asyncHandler(async (req, res) => {
  await addCommentService(req.params.id, req.user.id, req.body.text);
  successResponse(res, null, "Comment added successfully");
});

// GET statistics
export const getStats = asyncHandler(async (req, res) => {
  const stats = await getStatsService();
  successResponse(res, stats, "Statistics fetched successfully");
});

// GET featured testimonials
export const getFeatured = asyncHandler(async (req, res) => {
  const featured = await getFeaturedService();
  successResponse(res, featured, "Featured testimonials fetched successfully");
});

// GET trending testimonials
export const getTrending = asyncHandler(async (req, res) => {
  const data = await getTrendingService();
  successResponse(res, data, "Trending testimonials");
});

// GET by tag
export const getByTag = asyncHandler(async (req, res) => {
  const { tag } = req.query;
  const data = await getByTagService(tag);
  successResponse(res, data, `Testimonials for tag: ${tag}`);
});

// GET top rated
export const getTopRated = asyncHandler(async (req, res) => {
  const data = await getTopRatedService();
  successResponse(res, data, "Top rated testimonials");
});

// SHARE testimonial
export const shareTestimonial = asyncHandler(async (req, res) => {
  const updated = await shareTestimonialService(req.params.id);
  successResponse(res, updated, "Testimonial shared successfully");
});
