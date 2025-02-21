/*
  Warnings:

  - You are about to drop the column `pricePerNight` on the `Property` table. All the data in the column will be lost.
  - Added the required column `price` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnail` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Property" DROP COLUMN "pricePerNight",
ADD COLUMN     "attachments" TEXT[],
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "thumbnail" TEXT NOT NULL;
