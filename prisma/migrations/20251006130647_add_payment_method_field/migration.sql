/*
  Warnings:

  - Added the required column `paymentMethod` to the `PointVotes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."PointVotes" ADD COLUMN     "paymentMethod" TEXT NOT NULL;
