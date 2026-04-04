// src/app.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

import ApiRoutes from "./utils/apiRoutes.js";
import { errorHandler } from "./middlewares/error.js";
import { swaggerDocs } from "./utils/swagger.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

// Routes
app.use("/api", ApiRoutes);

// Swagger
swaggerDocs(app);

// Health & root
app.get("/", (req, res) => res.json({ message: "API working 🚀" }));
app.get("/health", (req, res) =>
  res.json({ status: "ok", uptime: process.uptime(), timestamp: new Date() }),
);

// ERROR handler last
app.use(errorHandler);

export default app;
