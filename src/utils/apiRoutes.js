import express from "express";

import authRoutes from "../modules/auth/auth.route.js";
import coursesRoutes from "../modules/courses/courses.route.js";
import companiesRoutes from "../modules/companies/companies.route.js";
import testimonialsRoutes from "../modules/testimonials/testimonials.route.js";
import uploadRoutes from "../modules/upload/upload.route.js";
import portfolioRoutes from "../modules/portfolio/portfolio.route.js";
import teamMembersRoutes from "../modules/teamMembers/teamMembers.route.js";

const router = express.Router();

// Modul routelarni ulaymiz
router.use("/auth", authRoutes);
router.use("/courses", coursesRoutes);
router.use("/companies", companiesRoutes);
router.use("/testimonials", testimonialsRoutes);
router.use("/upload", uploadRoutes);
router.use("/portfolio", portfolioRoutes);
router.use("/team-members", teamMembersRoutes);

export default router;
