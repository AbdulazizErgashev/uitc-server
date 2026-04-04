import fs from "fs";
import path from "path";
import { AppError } from "./AppError.js";

/**
 * Local file upload
 * @param {Buffer} fileBuffer - fayl kontenti
 * @param {string} fileName - fayl nomi
 * @param {string} folder - ichki papka nomi (masalan "portfolio")
 * @returns {Object} - { url: string } server orqali kirish uchun URL
 */
export const uploadToLocal = async (fileBuffer, fileName, folder = "") => {
  try {
    const imagesDir = path.join(process.cwd(), "images");
    const targetDir = folder ? path.join(imagesDir, folder) : imagesDir;

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const filePath = path.join(targetDir, fileName);
    await fs.promises.writeFile(filePath, fileBuffer);

    const url = folder
      ? `/images/${folder}/${fileName}`
      : `/images/${fileName}`;
    return { url };
  } catch (err) {
    console.error("Local Upload Error:", err);
    throw new AppError("File upload failed", 500);
  }
};

/**
 * Faylni o'chirish
 * @param {string} filePath - serverdagi to'liq fayl yo'li
 */
export const deleteLocalFile = async (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  } catch (err) {
    console.error("File deletion error:", err);
  }
};
