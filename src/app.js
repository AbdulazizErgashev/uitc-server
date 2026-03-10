import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.route.js";
import usersRoutes from "./routes/users.route.js";
import coursesRoutes from "./routes/courses.route.js";
import companiesRoutes from "./routes/companies.route.js";
import testimonialsRoutes from "./routes/testimonials.route.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/courses", coursesRoutes);
app.use("/api/companies", companiesRoutes);
app.use("/api/testimonials", testimonialsRoutes);

app.get("/", (req, res) => res.json({ message: "API working 🚀" }));

export default app;
