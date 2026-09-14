export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  if (!session.user) {
    throw createError({
      status: 401,
      message: 'Пользователь не авторизован'
    })
  }
  const gameUuid = getRouterParam(event, 'uuid')
  const eventId = parseInt(getRouterParam(event, 'id')!)
  const game = await prisma.game.findUnique({
    where: {
      uuid: gameUuid
    }
  })
  if (!game) {
    throw createError({
      status: 500,
      message: `Невозможно определить игру ${gameUuid}`
    })
  }
  if (game.finished) {
    throw createError({
      status: 500,
      message: `Невозможно удалить событие из завершённой игры`
    })
  }
  const roundEvent = prisma.roundEvent.findUnique({
    where: {
      id: eventId
    }
  })
  if (!roundEvent) {
    throw createError({
      status: 500,
      message: `Событие не найдено`
    })
  }
  await prisma.roundEvent.delete({
    where: {
      id: eventId
    }
  })
  return {}
})
