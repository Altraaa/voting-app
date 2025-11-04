-- DropForeignKey
ALTER TABLE "public"."PackageHistory" DROP CONSTRAINT "PackageHistory_packageId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PointVotes" DROP CONSTRAINT "PointVotes_packageId_fkey";

-- AlterTable
ALTER TABLE "public"."PackageHistory" ALTER COLUMN "packageId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."PointVotes" ADD COLUMN     "isCustom" BOOLEAN DEFAULT false,
ALTER COLUMN "packageId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."PointVotes" ADD CONSTRAINT "PointVotes_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "public"."Package"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PackageHistory" ADD CONSTRAINT "PackageHistory_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "public"."Package"("id") ON DELETE SET NULL ON UPDATE CASCADE;
