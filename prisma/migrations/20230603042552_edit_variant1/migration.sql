/*
  Warnings:

  - Changed the type of `active_period` on the `Variant` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Variant" DROP COLUMN "active_period",
ADD COLUMN     "active_period" INTEGER NOT NULL;
