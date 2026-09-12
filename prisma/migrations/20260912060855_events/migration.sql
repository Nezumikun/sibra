-- CreateEnum
CREATE TYPE "RoundEventType" AS ENUM ('START', 'KONG', 'MAHJONG', 'MAHJONG_AFTER_KONG', 'END_OF_WALL', 'TENPAI', 'NOTEN', 'FINISH', 'FAKE_MAHJONG', 'PENALTY');

-- CreateTable
CREATE TABLE "RoundEvents" (
    "id" SERIAL NOT NULL,
    "gameRoundId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" INTEGER NOT NULL,
    "type" "RoundEventType" NOT NULL,
    "victimPlayerId" INTEGER NOT NULL,

    CONSTRAINT "RoundEvents_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RoundEvents" ADD CONSTRAINT "RoundEvents_gameRoundId_fkey" FOREIGN KEY ("gameRoundId") REFERENCES "GameRound"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoundEvents" ADD CONSTRAINT "RoundEvents_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "GamePlayer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoundEvents" ADD CONSTRAINT "RoundEvents_victimPlayerId_fkey" FOREIGN KEY ("victimPlayerId") REFERENCES "GamePlayer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
