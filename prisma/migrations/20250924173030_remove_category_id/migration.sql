/*
  Warnings:

  - You are about to drop the column `categoryId` on the `TimelineItem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."TimelineItem" DROP CONSTRAINT "TimelineItem_categoryId_fkey";

-- AlterTable
ALTER TABLE "public"."TimelineItem" DROP COLUMN "categoryId";
