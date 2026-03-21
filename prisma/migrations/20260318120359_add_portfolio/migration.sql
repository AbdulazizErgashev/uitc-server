-- CreateEnum
CREATE TYPE "PortfolioCategory" AS ENUM ('web', 'mobile', 'app', 'three_d_modeling', 'three_d_animation', 'two_d_design', 'other');

-- CreateTable
CREATE TABLE "Portfolio" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" "PortfolioCategory" NOT NULL,
    "platform" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "url" TEXT,
    "media_url" TEXT,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Portfolio_pkey" PRIMARY KEY ("id")
);
