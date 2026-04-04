// src/index.js
import express from "express"; // ✅ express import qilinadi
import path from "path";
import dotenv from "dotenv";
import app from "./app.js";
import { prisma } from "../prisma/prisma.js";

dotenv.config();

const PORT = process.env.PORT || 5050;

// ✅ Static folder
app.use("/images", express.static(path.join(process.cwd(), "images")));

async function start() {
  try {
    await prisma.$connect();
    console.log("PostgreSQL connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("DB connection error:", error);
    process.exit(1);
  }
}

start();
