/*
  Warnings:

  - Added the required column `sellerId` to the `Categories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Categories" ADD COLUMN     "sellerId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Categories_sellerId_idx" ON "Categories"("sellerId");
