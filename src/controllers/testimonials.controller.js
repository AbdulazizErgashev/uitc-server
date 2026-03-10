import { prisma } from "../../prisma/prisma.js";

// GET ALL
export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      include: {
        user: true,
        course: true,
        company: true,
      },
      orderBy: { created_at: "desc" },
    });

    res.json(testimonials);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET ONE
export const getTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
      include: {
        user: true,
        course: true,
        company: true,
        comments: true,
      },
    });

    if (!testimonial)
      return res.status(404).json({ message: "Testimonial not found" });

    res.json(testimonial);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// CREATE
export const createTestimonial = async (req, res) => {
  try {
    const {
      course_id,
      company_id,
      name,
      role,
      quote,
      long_quote,
      rating,
      video_url,
      tags,
    } = req.body;

    const testimonial = await prisma.testimonial.create({
      data: {
        user_id: req.user.id,
        course_id,
        company_id,
        name,
        role,
        quote,
        long_quote,
        rating,
        video_url,
        tags,
        date: new Date(),
      },
    });

    res.status(201).json(testimonial);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE
export const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: req.body,
    });

    res.json(testimonial);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE
export const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.testimonial.delete({ where: { id } });

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// LIKES
export const likeTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const like = await prisma.like.create({
      data: {
        user_id: req.user.id,
        testimonial_id: id,
      },
    });

    await prisma.testimonial.update({
      where: { id },
      data: { likes_count: { increment: 1 } },
    });

    res.json(like);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// BOOKMARK
export const bookmarkTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const bookmark = await prisma.bookmark.create({
      data: {
        user_id: req.user.id,
        testimonial_id: id,
      },
    });

    res.json(bookmark);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// COMMENT
export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    const comment = await prisma.comment.create({
      data: {
        user_id: req.user.id,
        testimonial_id: id,
        text,
      },
    });

    await prisma.testimonial.update({
      where: { id },
      data: { comments_count: { increment: 1 } },
    });

    res.json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
