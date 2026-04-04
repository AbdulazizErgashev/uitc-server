// src/modules/upload/upload.controller.js
import { asyncHandler } from "../../utils/asyncHandler.js";
import { uploadToLocal } from "../../utils/uploadLocal.js"; // AWS o‘rniga local

export const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) throw new Error("File required");

  const fileName = `${Date.now()}-${req.file.originalname}`;
  const { url } = await uploadToLocal(req.file.buffer, fileName);

  res.status(200).json({ success: true, url });
});
