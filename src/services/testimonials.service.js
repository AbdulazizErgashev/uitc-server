import { prisma } from "../../prisma/prisma.js";
import { AppError } from "../utils/AppError.js";

// Get testimonials with filters, sorting, pagination
export const getTestimonialsService = async ({
  filters = {},
  queryOptions = {},
}) => {
  const total = await prisma.testimonial.count({ where: filters });

  // Merge filters into query options
  queryOptions.where = { ...queryOptions.where, ...filters };

  const testimonials = await prisma.testimonial.findMany(queryOptions);

  return {
    meta: {
      total,
      page: Number(queryOptions.page) || 1,
      limit: Number(queryOptions.take) || 10,
      pages: Math.ceil(total / (queryOptions.take || 10)),
    },
    testimonials,
  };
};

// Get single testimonial
export const getTestimonialByIdService = async (id) => {
  const testimonial = await prisma.testimonial.findUnique({
    where: { id },
    include: { user: true, course: true, company: true, comments: true },
  });
  if (!testimonial) throw new AppError("Testimonial not found", 404);
  return testimonial;
};

// Create testimonial
export const createTestimonialService = async (data) => {
  return await prisma.testimonial.create({ data });
};

// Update testimonial
export const updateTestimonialService = async (id, data) => {
  const exists = await prisma.testimonial.findUnique({ where: { id } });
  if (!exists) throw new AppError("Testimonial not found", 404);
  return await prisma.testimonial.update({ where: { id }, data });
};

// Delete testimonial
export const deleteTestimonialService = async (id) => {
  const exists = await prisma.testimonial.findUnique({ where: { id } });
  if (!exists) throw new AppError("Testimonial not found", 404);
  await prisma.testimonial.delete({ where: { id } });
  return true;
};

// Like testimonial
export const likeTestimonialService = async (testimonialId, userId) => {
  const existing = await prisma.like.findUnique({
    where: {
      user_id_testimonial_id: {
        user_id: userId,
        testimonial_id: testimonialId,
      },
    },
  });
  if (existing) throw new AppError("Already liked", 400);

  await prisma.$transaction([
    prisma.like.create({
      data: { user_id: userId, testimonial_id: testimonialId },
    }),
    prisma.testimonial.update({
      where: { id: testimonialId },
      data: { likes_count: { increment: 1 } },
    }),
  ]);

  return true;
};

// Bookmark testimonial
export const bookmarkTestimonialService = async (testimonialId, userId) => {
  const existing = await prisma.bookmark.findUnique({
    where: {
      user_id_testimonial_id: {
        user_id: userId,
        testimonial_id: testimonialId,
      },
    },
  });
  if (existing) throw new AppError("Already bookmarked", 400);

  await prisma.bookmark.create({
    data: { user_id: userId, testimonial_id: testimonialId },
  });
  return true;
};

// Add comment
export const addCommentService = async (testimonialId, userId, text) => {
  if (!text) throw new AppError("Comment text is required", 400);

  await prisma.$transaction([
    prisma.comment.create({
      data: { user_id: userId, testimonial_id: testimonialId, text },
    }),
    prisma.testimonial.update({
      where: { id: testimonialId },
      data: { comments_count: { increment: 1 } },
    }),
  ]);

  return true;
};

// Get stats
export const getStatsService = async () => {
  const [totalTestimonials, avgRatingAgg, companiesCount] = await Promise.all([
    prisma.testimonial.count(),
    prisma.testimonial.aggregate({ _avg: { rating: true } }),
    prisma.company.count(),
  ]);

  return {
    totalTestimonials,
    avgRating: avgRatingAgg._avg.rating || 0,
    companiesCount,
  };
};

// Get featured testimonials
export const getFeaturedService = async () => {
  return await prisma.testimonial.findMany({
    where: { featured: true },
    include: { user: true, course: true, company: true },
    orderBy: { created_at: "desc" },
  });
};
