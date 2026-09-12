/*
  Warnings:

  - Added the required column `createdById` to the `GameRound` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GameRound" ADD COLUMN     "createdById" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "GameRound" ADD CONSTRAINT "GameRound_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "GamePlayer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
