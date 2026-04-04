/*
  Warnings:

  - You are about to drop the column `color` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `is_public` on the `Portfolio` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "color";

-- AlterTable
ALTER TABLE "Course" ALTER COLUMN "duration" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Portfolio" DROP COLUMN "is_public";
