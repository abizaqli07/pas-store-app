/*
  Warnings:

  - The values [EXPIRED] on the enum `STATUS` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "PERIOD" AS ENUM ('ACTIVE', 'EXPIRED');

-- AlterEnum
BEGIN;
CREATE TYPE "STATUS_new" AS ENUM ('ORDERED', 'COMPLETED');
ALTER TABLE "Order" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Order" ALTER COLUMN "status" TYPE "STATUS_new" USING ("status"::text::"STATUS_new");
ALTER TYPE "STATUS" RENAME TO "STATUS_old";
ALTER TYPE "STATUS_new" RENAME TO "STATUS";
DROP TYPE "STATUS_old";
ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'ORDERED';
COMMIT;

-- AlterTable
ALTER TABLE "Premium" ADD COLUMN     "status" "PERIOD" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "image" TEXT;
