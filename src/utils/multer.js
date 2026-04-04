// src/utils/multer.js
import multer from "multer";

// In-memory storage (buffer bilan ishlash)
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});
