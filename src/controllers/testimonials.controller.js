import { prisma } from "../../prisma/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";

// GET /api/testimonials
export const getTestimonials = asyncHandler(async (req, res) => {
  let { page = 1, limit = 10, company, course, year, search, sort } = req.query;

  page = Math.max(Number(page), 1);
  limit = Math.min(Math.max(Number(limit), 1), 100); // max 100 per page

  const filters = {};
  if (company) filters.company_id = company;
  if (course) filters.course_id = course;
  if (year) {
    const start = new Date(`${year}-01-01`);
    const end = new Date(`${Number(year) + 1}-01-01`);
    filters.date = { gte: start, lt: end };
  }
  if (search) {
    filters.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { quote: { contains: search, mode: "insensitive" } },
      { long_quote: { contains: search, mode: "insensitive" } },
    ];
  }

  let orderBy = { created_at: "desc" };
  if (sort === "popular") orderBy = { likes_count: "desc" };
  else if (sort === "rating") orderBy = { rating: "desc" };
  else if (sort === "recent") orderBy = { created_at: "desc" };

  const total = await prisma.testimonial.count({ where: filters });

  const testimonials = await prisma.testimonial.findMany({
    where: filters,
    include: { user: true, course: true, company: true },
    orderBy,
    skip: (page - 1) * limit,
    take: limit,
  });

  res.json({
    success: true,
    meta: { total, page, limit, pages: Math.ceil(total / limit) },
    data: testimonials,
  });
});

// GET single
export const getTestimonial = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const testimonial = await prisma.testimonial.findUnique({
    where: { id },
    include: { user: true, course: true, company: true, comments: true },
  });
  if (!testimonial) throw new AppError("Testimonial not found", 404);

  res.json({ success: true, data: testimonial });
});

// CREATE
export const createTestimonial = asyncHandler(async (req, res) => {
  const data = { ...req.body, user_id: req.user.id, date: new Date() };
  const testimonial = await prisma.testimonial.create({ data });
  res.status(201).json({ success: true, data: testimonial });
});

// UPDATE
export const updateTestimonial = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const exists = await prisma.testimonial.findUnique({ where: { id } });
  if (!exists) throw new AppError("Testimonial not found", 404);

  const testimonial = await prisma.testimonial.update({
    where: { id },
    data: req.body,
  });
  res.json({ success: true, data: testimonial });
});

// DELETE
export const deleteTestimonial = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const exists = await prisma.testimonial.findUnique({ where: { id } });
  if (!exists) throw new AppError("Testimonial not found", 404);

  await prisma.testimonial.delete({ where: { id } });
  res.json({ success: true, message: "Deleted successfully" });
});

// LIKE (transaction-safe)
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

  res.json({ success: true, message: "Liked successfully" });
});

// BOOKMARK
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

  res.json({ success: true, message: "Bookmarked successfully" });
});

// COMMENT
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

  res.json({ success: true, message: "Comment added successfully" });
});

// STATS
export const getStats = asyncHandler(async (req, res) => {
  const [totalTestimonials, avgRatingAgg, companiesCount] = await Promise.all([
    prisma.testimonial.count(),
    prisma.testimonial.aggregate({ _avg: { rating: true } }),
    prisma.company.count(),
  ]);

  res.json({
    success: true,
    data: {
      totalTestimonials,
      avgRating: avgRatingAgg._avg.rating || 0,
      companiesCount,
    },
  });
});

// FEATURED
export const getFeatured = asyncHandler(async (req, res) => {
  const featured = await prisma.testimonial.findMany({
    where: { featured: true },
    include: { user: true, course: true, company: true },
    orderBy: { created_at: "desc" },
  });
  res.json({ success: true, data: featured });
});
