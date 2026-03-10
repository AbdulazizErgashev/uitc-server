import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

export const prisma = new PrismaClient({
  datasources: {
    db: {
      adapter: "postgresql",
      url: process.env.DATABASE_URL,
    },
  },
});