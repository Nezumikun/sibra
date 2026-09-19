-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "RoundEventType" ADD VALUE 'DOUBLE_MAHJONG';
ALTER TYPE "RoundEventType" ADD VALUE 'TRIPLE_MAHJONG';

-- AlterTable
ALTER TABLE "RoundEvent" ADD COLUMN     "parentId" INTEGER;

-- AddForeignKey
ALTER TABLE "RoundEvent" ADD CONSTRAINT "RoundEvent_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "RoundEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
