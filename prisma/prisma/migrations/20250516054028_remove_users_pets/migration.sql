/*
  Warnings:

  - You are about to drop the column `user_id` on the `pets` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "pets" DROP CONSTRAINT "pets_user_id_fkey";

-- DropIndex
DROP INDEX "pets_user_id_idx";

-- AlterTable
ALTER TABLE "pets" DROP COLUMN "user_id";
