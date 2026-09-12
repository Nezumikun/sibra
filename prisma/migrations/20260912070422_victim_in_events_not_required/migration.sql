-- DropForeignKey
ALTER TABLE "RoundEvent" DROP CONSTRAINT "RoundEvent_victimPlayerId_fkey";

-- AlterTable
ALTER TABLE "RoundEvent" ALTER COLUMN "victimPlayerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "RoundEvent" ADD CONSTRAINT "RoundEvent_victimPlayerId_fkey" FOREIGN KEY ("victimPlayerId") REFERENCES "GamePlayer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
