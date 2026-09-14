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
  if (gameRounds.length === 0) {
    throw createError({
      status: 500,
      message: `Не найдено незавершённых раундов для игры ${session.currentGame.uuid}`
    })
  }
  if (gameRounds.length > 1) {
    throw createError({
      status: 500,
      message: `Найдено больше одного незавершённого раунда для игры ${session.currentGame.uuid}. Это ненормально...`
    })
  }
  const gameRound = gameRounds[0]!
  // console.log(data, session.currentGame, gameRound)
  await prisma.roundEvent.create({
    data: {
      gameRoundId: gameRound?.id,
      type: data.type,
      createdById: data.player,
      victimPlayerId: data.victim === -1 ? null : data.victim
    }
  })
  await setUserSession(event, session)
  return {}
})
