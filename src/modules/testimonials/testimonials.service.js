import { prisma } from "../../../prisma/prisma.js";
import { AppError } from "../../utils/AppError.js";

export const getTestimonialsService = async ({
  filters = {},
  queryOptions = {},
}) => {
  const total = await prisma.testimonial.count({ where: filters });
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

export const getTestimonialByIdService = async (id) => {
  const testimonial = await prisma.testimonial.findUnique({
    where: { id },
    include: { user: true, course: true, company: true, comments: true },
  });
  if (!testimonial) throw new AppError("Testimonial not found", 404);
  return testimonial;
};

export const createTestimonialService = async (data) => {
  return await prisma.testimonial.create({ data });
};

export const updateTestimonialService = async (id, data) => {
  const exists = await prisma.testimonial.findUnique({ where: { id } });
  if (!exists) throw new AppError("Testimonial not found", 404);
  return await prisma.testimonial.update({ where: { id }, data });
};

export const deleteTestimonialService = async (id) => {
  const exists = await prisma.testimonial.findUnique({ where: { id } });
  if (!exists) throw new AppError("Testimonial not found", 404);
  await prisma.testimonial.delete({ where: { id } });
  return true;
};

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

export const getFeaturedService = async () => {
  return await prisma.testimonial.findMany({
    where: { featured: true },
    include: { user: true, course: true, company: true },
    orderBy: { created_at: "desc" },
  });
};

export const getTrendingService = async (limit = 5) => {
  return await prisma.testimonial.findMany({
    orderBy: { likes_count: "desc" },
    take: limit,
    include: { user: true, course: true, company: true },
  });
};

export const getByTagService = async (tag) => {
  return await prisma.testimonial.findMany({
    where: { tags: { has: tag } },
    include: { user: true, course: true, company: true },
  });
};

export const getTopRatedService = async (limit = 5) => {
  return await prisma.testimonial.findMany({
    orderBy: { rating: "desc" },
    take: limit,
    include: { user: true, course: true, company: true },
  });
};

export const shareTestimonialService = async (testimonialId) => {
  const exists = await prisma.testimonial.findUnique({
    where: { id: testimonialId },
  });
  if (!exists) throw new AppError("Testimonial not found", 404);

  return await prisma.testimonial.update({
    where: { id: testimonialId },
    data: { shares_count: { increment: 1 } },
  });
};
