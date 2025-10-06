/*
  Warnings:

  - A unique constraint covering the columns `[name,categoryId]` on the table `Candidate` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,eventId]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `description` to the `Candidate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventId` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('success', 'failed', 'pending');

-- CreateEnum
CREATE TYPE "public"."StatusEvent" AS ENUM ('live', 'upcoming', 'ended');

-- CreateEnum
CREATE TYPE "public"."SupportType" AS ENUM ('BASIC', 'PRIORITY', 'PREMIUM', 'VIP');

-- DropIndex
DROP INDEX "public"."Candidate_name_key";

-- DropIndex
DROP INDEX "public"."Category_name_key";

-- AlterTable
ALTER TABLE "public"."Candidate" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "photo_url" TEXT;

-- AlterTable
ALTER TABLE "public"."Category" ADD COLUMN     "eventId" TEXT NOT NULL,
ADD COLUMN     "photo_url" TEXT;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "avatar_url" TEXT;

-- CreateTable
CREATE TABLE "public"."Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "photo_url" TEXT,
    "status" "public"."StatusEvent" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Package" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "points" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "originalPrice" INTEGER,
    "validityDays" INTEGER NOT NULL,
    "supportType" "public"."SupportType" NOT NULL,
    "bonusPercentage" INTEGER,
    "earlyAccess" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Package_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PointVotes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "payment_status" "public"."PaymentStatus" NOT NULL,
    "merchantOrderId" TEXT NOT NULL,
    "reference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PointVotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PackageHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "purchaseDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pointsReceived" INTEGER NOT NULL,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackageHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EventMember" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PointVotes_merchantOrderId_key" ON "public"."PointVotes"("merchantOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "PackageHistory_userId_packageId_purchaseDate_key" ON "public"."PackageHistory"("userId", "packageId", "purchaseDate");

-- CreateIndex
CREATE UNIQUE INDEX "EventMember_userId_eventId_key" ON "public"."EventMember"("userId", "eventId");

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_name_categoryId_key" ON "public"."Candidate"("name", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_eventId_key" ON "public"."Category"("name", "eventId");

-- AddForeignKey
ALTER TABLE "public"."Category" ADD CONSTRAINT "Category_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PointVotes" ADD CONSTRAINT "PointVotes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PointVotes" ADD CONSTRAINT "PointVotes_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "public"."Package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PackageHistory" ADD CONSTRAINT "PackageHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PackageHistory" ADD CONSTRAINT "PackageHistory_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "public"."Package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventMember" ADD CONSTRAINT "EventMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventMember" ADD CONSTRAINT "EventMember_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
