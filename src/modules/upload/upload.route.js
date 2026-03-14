import express from "express";
import multer from "multer";
import { authMiddleware } from "../../middlewares/auth.js";
import { adminMiddleware } from "../../middlewares/role.js";
import { uploadFile } from "./upload.controller.js";

const router = express.Router();
const upload = multer();

router.use(authMiddleware, adminMiddleware);
router.post("/", upload.single("file"), uploadFile);

export default router;
