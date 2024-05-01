/*
  Warnings:

  - The `id` column on the `City` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropIndex
DROP INDEX "City_id_key";

-- AlterTable
ALTER TABLE "City" DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "City_pkey" PRIMARY KEY ("id");
