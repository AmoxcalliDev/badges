/*
  Warnings:

  - You are about to drop the column `type` on the `account` table. All the data in the column will be lost.
  - You are about to drop the column `validity` on the `account` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "account" DROP COLUMN "type",
DROP COLUMN "validity";
