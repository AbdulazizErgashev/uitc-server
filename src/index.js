// index.js
import app from "./app.js";
import dotenv from "dotenv";
import { prisma } from "../prisma/prisma.js";

dotenv.config();

const PORT = process.env.PORT || 5050;

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
