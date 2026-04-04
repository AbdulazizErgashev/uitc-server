import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;

// Create a new pool using the connection string
const pool = new Pool({ connectionString });

// Create the Prisma Client with the adapter
export const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});
