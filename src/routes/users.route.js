import express from "express";
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/users.js";
import { authMiddleware } from "../middleware/auth.js";
import { adminMiddleware } from "../middleware/role.js";

const router = express.Router();

// Hammasi adminga maxsus
router.use(authMiddleware, adminMiddleware);

router.get("/", getUsers);
router.get("/:id", getUser);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
