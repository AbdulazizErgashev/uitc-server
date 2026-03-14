import { asyncHandler } from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import { APIFeatures } from "../../utils/apiFeatures.js";
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

export const getTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await getTestimonialByIdService(req.params.id);
  successResponse(res, testimonial, "Testimonial fetched successfully");
});

export const createTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await createTestimonialService({
    ...req.body,
    user_id: req.user.id,
    date: new Date(),
  });
  successResponse(res, testimonial, "Testimonial created successfully");
});

export const updateTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await updateTestimonialService(req.params.id, req.body);
  successResponse(res, testimonial, "Testimonial updated successfully");
});

export const deleteTestimonial = asyncHandler(async (req, res) => {
  await deleteTestimonialService(req.params.id);
  successResponse(res, null, "Testimonial deleted successfully");
});

export const likeTestimonial = asyncHandler(async (req, res) => {
  await likeTestimonialService(req.params.id, req.user.id);
  successResponse(res, null, "Testimonial liked successfully");
});

export const bookmarkTestimonial = asyncHandler(async (req, res) => {
  await bookmarkTestimonialService(req.params.id, req.user.id);
  successResponse(res, null, "Testimonial bookmarked successfully");
});

export const addComment = asyncHandler(async (req, res) => {
  await addCommentService(req.params.id, req.user.id, req.body.text);
  successResponse(res, null, "Comment added successfully");
});

export const getStats = asyncHandler(async (req, res) => {
  const stats = await getStatsService();
  successResponse(res, stats, "Statistics fetched successfully");
});

export const getFeatured = asyncHandler(async (req, res) => {
  const featured = await getFeaturedService();
  successResponse(res, featured, "Featured testimonials fetched successfully");
});

export const getTrending = asyncHandler(async (req, res) => {
  const data = await getTrendingService();
  successResponse(res, data, "Trending testimonials");
});

export const getByTag = asyncHandler(async (req, res) => {
  const { tag } = req.query;
  const data = await getByTagService(tag);
  successResponse(res, data, `Testimonials for tag: ${tag}`);
});

export const getTopRated = asyncHandler(async (req, res) => {
  const data = await getTopRatedService();
  successResponse(res, data, "Top rated testimonials");
});

export const shareTestimonial = asyncHandler(async (req, res) => {
  const updated = await shareTestimonialService(req.params.id);
  successResponse(res, updated, "Testimonial shared successfully");
});
