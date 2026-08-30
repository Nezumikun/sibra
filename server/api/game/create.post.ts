import { z } from 'zod'

const schema = z.object({
  east: z.int().positive('Не выбран игрок на востоке'),
  south: z.int().positive('Не выбран игрок на юге'),
  west: z.int().positive('Не выбран игрок на западе'),
  north: z.int().positive('Не выбран игрок на севере'),
  roundLimit: z.int().positive()
})

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  console.log(session)
  const gameParams = await readValidatedBody(event, schema.parse)

  if (session.user) {
    const game = await prisma.game.create({
      data: {
        createdById: session.user.id,
        roundLimit: gameParams.roundLimit,
        players: {
          create: [
            {
              playerId: gameParams.east,
              initialPlace: 'EAST'
            },
            {
              playerId: gameParams.south,
              initialPlace: 'SOUTH'
            },
            {
              playerId: gameParams.west,
              initialPlace: 'WEST'
            },
            {
              playerId: gameParams.north,
              initialPlace: 'NORTH'
            }
          ]
        }
      }
    })
    session.currentGame = game
    await setUserSession(event, session)
  }
  return {}
})
