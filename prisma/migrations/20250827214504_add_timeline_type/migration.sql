/*
  Warnings:

  - Added the required column `type` to the `TimelineItem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."TimelineDateType" AS ENUM ('EXACT', 'ESTIMATE_MONTH', 'ESTIMATE_YEAR');

-- AlterTable
ALTER TABLE "public"."TimelineItem" ADD COLUMN     "type" "public"."TimelineDateType" NULL;

UPDATE "public"."TimelineItem" set "type" = 'EXACT';

ALTER TABLE "public"."TimelineItem" ALTER COLUMN "type" SET NOT NULL;
