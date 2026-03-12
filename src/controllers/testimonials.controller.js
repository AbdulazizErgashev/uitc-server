import { prisma } from "../../prisma/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import { successResponse } from "../utils/apiResponse.js";
import { APIFeatures } from "../utils/apiFeatures.js";

// GET /api/testimonials (with filtering, sorting, pagination)
export const getTestimonials = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, company, course, year, search } = req.query;

  // Advanced filters
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

  // Initialize APIFeatures
  const features = new APIFeatures(prisma.testimonial, req.query)
    .filter()
    .sort()
    .paginate();

  // Merge advanced filters into Prisma query
  features.queryOptions.where = {
    ...features.queryOptions.where,
    ...filterObj,
  };

  // Count total for meta
  const total = await prisma.testimonial.count({
    where: features.queryOptions.where,
  });

  const testimonials = await features.execute();

  successResponse(
    res,
    {
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
      testimonials,
    },
    "Testimonials fetched successfully",
  );
});

// GET single testimonial
export const getTestimonial = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const testimonial = await prisma.testimonial.findUnique({
    where: { id },
    include: { user: true, course: true, company: true, comments: true },
  });

  if (!testimonial) throw new AppError("Testimonial not found", 404);

  successResponse(res, testimonial, "Testimonial fetched successfully");
});

// CREATE testimonial
export const createTestimonial = asyncHandler(async (req, res) => {
  const data = { ...req.body, user_id: req.user.id, date: new Date() };

  const testimonial = await prisma.testimonial.create({ data });

  successResponse(res, testimonial, "Testimonial created successfully");
});

// UPDATE testimonial
export const updateTestimonial = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const exists = await prisma.testimonial.findUnique({ where: { id } });
  if (!exists) throw new AppError("Testimonial not found", 404);

  const testimonial = await prisma.testimonial.update({
    where: { id },
    data: req.body,
  });

  successResponse(res, testimonial, "Testimonial updated successfully");
});

// DELETE testimonial
export const deleteTestimonial = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const exists = await prisma.testimonial.findUnique({ where: { id } });
  if (!exists) throw new AppError("Testimonial not found", 404);

  await prisma.testimonial.delete({ where: { id } });

  successResponse(res, null, "Testimonial deleted successfully");
});

// LIKE testimonial (transaction-safe)
export const likeTestimonial = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const existing = await prisma.like.findUnique({
    where: {
      user_id_testimonial_id: { user_id: req.user.id, testimonial_id: id },
    },
  });
  if (existing) throw new AppError("Already liked", 400);

  await prisma.$transaction([
    prisma.like.create({
      data: { user_id: req.user.id, testimonial_id: id },
    }),
    prisma.testimonial.update({
      where: { id },
      data: { likes_count: { increment: 1 } },
    }),
  ]);

  successResponse(res, null, "Testimonial liked successfully");
});

// BOOKMARK testimonial
export const bookmarkTestimonial = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const existing = await prisma.bookmark.findUnique({
    where: {
      user_id_testimonial_id: { user_id: req.user.id, testimonial_id: id },
    },
  });
  if (existing) throw new AppError("Already bookmarked", 400);

  await prisma.bookmark.create({
    data: { user_id: req.user.id, testimonial_id: id },
  });

  successResponse(res, null, "Testimonial bookmarked successfully");
});

// ADD COMMENT
export const addComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!text) throw new AppError("Comment text is required", 400);

  await prisma.$transaction([
    prisma.comment.create({
      data: { user_id: req.user.id, testimonial_id: id, text },
    }),
    prisma.testimonial.update({
      where: { id },
      data: { comments_count: { increment: 1 } },
    }),
  ]);

  successResponse(res, null, "Comment added successfully");
});

// GET stats
export const getStats = asyncHandler(async (req, res) => {
  const [totalTestimonials, avgRatingAgg, companiesCount] = await Promise.all([
    prisma.testimonial.count(),
    prisma.testimonial.aggregate({ _avg: { rating: true } }),
    prisma.company.count(),
  ]);

  successResponse(
    res,
    {
      totalTestimonials,
      avgRating: avgRatingAgg._avg.rating || 0,
      companiesCount,
    },
    "Statistics fetched successfully",
  );
});

// GET featured testimonials
export const getFeatured = asyncHandler(async (req, res) => {
  const featured = await prisma.testimonial.findMany({
    where: { featured: true },
    include: { user: true, course: true, company: true },
    orderBy: { created_at: "desc" },
  });

  successResponse(res, featured, "Featured testimonials fetched successfully");
});
