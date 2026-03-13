import AWS from "aws-sdk";
import dotenv from "dotenv";
import { AppError } from "./apiResponse.js";

dotenv.config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export const uploadToS3 = async (fileBuffer, fileName, mimeType) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: fileBuffer,
    ContentType: mimeType,
    ACL: "public-read",
  };

  try {
    const { Location } = await s3.upload(params).promise();
    return Location; // S3 public URL
  } catch (err) {
    console.error(err);
    throw new AppError("File upload failed", 500);
  }
};
