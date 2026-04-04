// src/utils/uploadLocal.js
import fs from "fs";
import path from "path";
import { AppError } from "./AppError.js";

// ✅ Local upload function
export const uploadToLocal = async (fileBuffer, fileName) => {
  try {
    // images papkasi mavjudligini tekshiramiz
    const imagesDir = path.join(process.cwd(), "images");
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir);
    }

    // faylni images/ papkaga yozamiz
    const filePath = path.join(imagesDir, fileName);
    await fs.promises.writeFile(filePath, fileBuffer);

    // URL: server orqali ulashish uchun
    const url = `/images/${fileName}`; // frontendda <img src="http://localhost:5000/images/..." />

    return { url };
  } catch (err) {
    console.error("Local Upload Error:", err);
    throw new AppError("File upload failed", 500);
  }
};