/*
  Warnings:

  - The `status` column on the `Interview` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."InterviewStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');

-- AlterTable
ALTER TABLE "public"."Interview" DROP COLUMN "status",
ADD COLUMN     "status" "public"."InterviewStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "public"."Question" ADD COLUMN     "expectedAnswer" TEXT,
ADD COLUMN     "improvements" TEXT,
ADD COLUMN     "order" INTEGER,
ADD COLUMN     "strengths" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
