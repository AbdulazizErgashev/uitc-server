import express from "express";
import {
  register,
  login,
  me,
  update,
} from "../controllers/adminAuth.controller.js";
import { authMiddleware } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import {
  adminRegisterSchema,
  adminLoginSchema,
  adminUpdateSchema,
} from "../validators/adminAuth.validator.js";

const router = express.Router();

// Register only if no admin exists (first setup)
router.post("/register", validate(adminRegisterSchema), register);

// Login
router.post("/login", validate(adminLoginSchema), login);

// Authenticated routes
router.use(authMiddleware);

// Get profile
router.get("/me", me);

// Update phone & password
router.patch("/update", validate(adminUpdateSchema), update);

export default router;
