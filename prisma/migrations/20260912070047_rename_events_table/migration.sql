/*
  Warnings:

  - You are about to drop the `RoundEvents` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RoundEvents" DROP CONSTRAINT "RoundEvents_createdById_fkey";

-- DropForeignKey
ALTER TABLE "RoundEvents" DROP CONSTRAINT "RoundEvents_gameRoundId_fkey";

-- DropForeignKey
ALTER TABLE "RoundEvents" DROP CONSTRAINT "RoundEvents_victimPlayerId_fkey";

-- DropTable
DROP TABLE "RoundEvents";

-- CreateTable
CREATE TABLE "RoundEvent" (
    "id" SERIAL NOT NULL,
    "gameRoundId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" INTEGER NOT NULL,
    "type" "RoundEventType" NOT NULL,
    "victimPlayerId" INTEGER NOT NULL,

    CONSTRAINT "RoundEvent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RoundEvent" ADD CONSTRAINT "RoundEvent_gameRoundId_fkey" FOREIGN KEY ("gameRoundId") REFERENCES "GameRound"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoundEvent" ADD CONSTRAINT "RoundEvent_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "GamePlayer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoundEvent" ADD CONSTRAINT "RoundEvent_victimPlayerId_fkey" FOREIGN KEY ("victimPlayerId") REFERENCES "GamePlayer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
