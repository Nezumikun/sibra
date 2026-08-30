export default defineEventHandler(async (event) => {
  const uuid = getRouterParam(event, 'uuid')
  const session = await getUserSession(event)

  if (session.user) {
    const game = await prisma.game.findUnique({
      include: {
        players: {
          omit: {
            gameId: true
          },
          include: {
            player: {
              select: {
                fullName: true
              }
            }
          }
        }
      },
      where: {
        uuid: uuid,
        OR: [
          {
            createdById: session.user?.id
          },
          {
            players: {
              some: {
                playerId: session.user?.id
              }
            }
          }
        ]
      }
    })
    if (game) {
      return game
    } else {
      throw createError({
        status: 403,
        message: 'У вас нет доступа к данным этой игры'
      })
    }
  }
  throw createError({
    status: 401,
    message: 'Вы не авторизованы'
  })
})
