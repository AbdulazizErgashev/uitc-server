/*
  Warnings:

  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,testimonial_id]` on the table `Bookmark` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,testimonial_id]` on the table `Like` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email",
DROP COLUMN "role",
ADD COLUMN     "phone" TEXT;

-- DropEnum
DROP TYPE "Role";

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_user_id_testimonial_id_key" ON "Bookmark"("user_id", "testimonial_id");

-- CreateIndex
CREATE UNIQUE INDEX "Like_user_id_testimonial_id_key" ON "Like"("user_id", "testimonial_id");

-- CreateIndex
CREATE INDEX "Testimonial_course_id_idx" ON "Testimonial"("course_id");

-- CreateIndex
CREATE INDEX "Testimonial_company_id_idx" ON "Testimonial"("company_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
