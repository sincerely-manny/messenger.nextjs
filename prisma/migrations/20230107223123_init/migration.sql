/*
  Warnings:

  - You are about to drop the column `picture` on the `Chat` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "picture";
ALTER TABLE "Chat" ADD COLUMN     "image" STRING;
