import { prisma } from "../../prisma/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// GET /api/testimonials
export const getTestimonials = asyncHandler(async (req, res) => {
  let { page = 1, limit = 10, company, course, year, search, sort } = req.query;

  page = Number(page);
  limit = Number(limit);

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

  let orderBy = { created_at: "desc" }; // default
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

// GET /api/testimonials/:id
export const getTestimonial = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const testimonial = await prisma.testimonial.findUnique({
    where: { id },
    include: { user: true, course: true, company: true, comments: true },
  });
  if (!testimonial)
    return res.status(404).json({ message: "Testimonial not found" });
  res.json({ success: true, data: testimonial });
});

// POST /api/testimonials
export const createTestimonial = asyncHandler(async (req, res) => {
  const data = { ...req.body, user_id: req.user.id, date: new Date() };
  const testimonial = await prisma.testimonial.create({ data });
  res.status(201).json({ success: true, data: testimonial });
});

// PATCH /api/testimonials/:id
export const updateTestimonial = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const testimonial = await prisma.testimonial.update({
    where: { id },
    data: req.body,
  });
  res.json({ success: true, data: testimonial });
});

// DELETE /api/testimonials/:id
export const deleteTestimonial = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await prisma.testimonial.delete({ where: { id } });
  res.json({ success: true, message: "Deleted successfully" });
});

// POST /api/testimonials/:id/like
export const likeTestimonial = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const like = await prisma.like.create({
    data: { user_id: req.user.id, testimonial_id: id },
  });
  await prisma.testimonial.update({
    where: { id },
    data: { likes_count: { increment: 1 } },
  });
  res.json({ success: true, data: like });
});

// POST /api/testimonials/:id/bookmark
export const bookmarkTestimonial = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const bookmark = await prisma.bookmark.create({
    data: { user_id: req.user.id, testimonial_id: id },
  });
  res.json({ success: true, data: bookmark });
});

// POST /api/testimonials/:id/comment
export const addComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const comment = await prisma.comment.create({
    data: { user_id: req.user.id, testimonial_id: id, text },
  });
  await prisma.testimonial.update({
    where: { id },
    data: { comments_count: { increment: 1 } },
  });
  res.json({ success: true, data: comment });
});

// GET /api/stats
export const getStats = asyncHandler(async (req, res) => {
  const totalTestimonials = await prisma.testimonial.count();
  const avgRating = await prisma.testimonial.aggregate({
    _avg: { rating: true },
  });
  const companiesCount = await prisma.company.count();

  res.json({
    success: true,
    data: {
      totalTestimonials,
      avgRating: avgRating._avg.rating,
      companiesCount,
    },
  });
});

// GET /api/stats/featured
export const getFeatured = asyncHandler(async (req, res) => {
  const featured = await prisma.testimonial.findMany({
    where: { featured: true },
    include: { user: true, course: true, company: true },
    orderBy: { created_at: "desc" },
  });
  res.json({ success: true, data: featured });
});
