import type { Game } from '~~/generated/prisma/client'

export default async function (game: Game, dealer: number) {
  const currentRoundCount = await prisma.gameRound.count({
    where: {
      gameId: game.id
    }
  })
  const round = await prisma.gameRound.create({
    data: {
      gameId: game.id,
      number: currentRoundCount + 1,
      createdById: dealer
    }
  })
  const _event = await prisma.roundEvent.create({
    data: {
      gameRoundId: round.id,
      createdById: dealer,
      type: 'START',
      victimPlayerId: null
    }
  })
}
