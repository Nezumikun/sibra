import type { GamePlayEvent } from '~~/shared/types/GamePlayEvent'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  if (!session.user) {
    throw createError({
      status: 401,
      message: 'Пользователь не авторизован'
    })
  }
  if (!session.currentGame) {
    throw createError({
      status: 500,
      message: 'Невозможно определить игру'
    })
  }
  const data = await readBody(event) as GamePlayEvent
  const gameId: number = session.currentGame.id
  const gameRounds = await prisma.gameRound.findMany({
    where: {
      gameId: gameId,
      finishedAt: null
    }
  })
  if (gameRounds.length > 1) {
    throw createError({
      status: 500,
      message: `Найдено больше одного незавершённого раунда для игры ${session.currentGame.uuid}. Это ненормально...`
    })
  }
  const gameRound = gameRounds[0]!
  if (!gameRound) {
    throw createError({
      status: 500,
      message: `Не найдено незавершённых раундов для игры ${session.currentGame.uuid}`
    })
  }
  // console.log(data, session.currentGame, gameRound)
  if (data.type === 'DOUBLE_MAHJONG' || data.type === 'TRIPLE_MAHJONG') {
    if (!data.victim) {
      throw createError({
        status: 500,
        message: `Не указан игрок, с которого взяли множественный маджонг`
      })
    }
    if (data.victim === -1) {
      throw createError({
        status: 500,
        message: `Множественный маджонг не может быть взят со стены`
      })
    }
    await prisma.$transaction(async (tx) => {
      if (!data.winners) {
        throw createError({
          status: 500,
          message: `Не указаны игроки, объявившие множественный маджонг`
        })
      }
      const parent = await tx.roundEvent.create({
        data: {
          gameRoundId: gameRound.id,
          type: data.type,
          createdById: data.victim,
          victimPlayerId: data.victim
        }
      })
      for (const winner of data.winners) {
        await tx.roundEvent.create({
          data: {
            gameRoundId: gameRound.id,
            parentId: parent.id,
            type: data.afterKong ? 'MAHJONG_AFTER_KONG' : 'MAHJONG',
            createdById: parseInt(winner),
            victimPlayerId: data.victim
          }
        })
      }
    })
  } else {
    if (data.player) {
      await prisma.roundEvent.create({
        data: {
          gameRoundId: gameRound.id,
          type: data.type,
          createdById: data.player,
          victimPlayerId: data.victim === -1 ? null : data.victim
        }
      })
    }
  }
  await setUserSession(event, session)
  return {}
})
