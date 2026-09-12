import type { Game } from '~~/generated/prisma/client'
import type { GameCreateData } from '~~/shared/types/GameCreateData'
import BeginRound from './BeginRound'

export default async function (data: GameCreateData, createdById: number): Promise<Game> {
  const game = await prisma.game.create({
    data: {
      createdById: createdById,
      roundLimit: data.settings.roundLimit,
      playersCount: data.settings.playersCount,
      players: {
        create: data.players.filter(x => x.wind !== null).map(x => ({ playerId: x.player.id, initialPlace: EnumWindToWind(x.wind!) }))
      }
    }
  })
  const dealer = data.players.find(x => x.wind === EnumWind.EAST)
  if (dealer) {
    await BeginRound(game, dealer.player.id)
  } else {
    throw createError({
      status: 500,
      message: 'Не удалось определить дилера'
    })
  }
  return game
}
