import { asyncHandler } from "../utils/apiResponse.js";
import { uploadToS3 } from "../utils/s3.js";

// Single file upload
export const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) throw new Error("File required");

  const fileName = `${Date.now()}-${req.file.originalname}`;
  const fileUrl = await uploadToS3(
    req.file.buffer,
    fileName,
    req.file.mimetype,
  );

  res.status(200).json({ success: true, url: fileUrl });
});
