import { z } from 'zod'
import * as bcrypt from 'bcrypt'

const bodySchema = z.object({
  email: z.email(),
  password: z.string().min(6)
})

export default defineEventHandler(async (event) => {
  const { email, password } = await readValidatedBody(event, bodySchema.parse)

  const player = await prisma.player.findUnique({
    where: {
      email: email
    }
  })
  console.log ('player', player)

  if (player) {
    const match = await bcrypt.compare(password, player.password)
    if (match) {
      const currentGame = await prisma.game.findFirst({
        where: {
          OR: [
            {
              createdById: player.id
            },
            {
              players: {
                some: {
                  playerId: player.id
                }
              }
            }
          ],
          finished: false
        }
      })
      await setUserSession(event, {
        user: {
          id: player.id,
          name: player.name!,
          fullName: player.fullName!
        },
        currentGame: currentGame
      })
      return {}
    }
  }
  throw createError({
    status: 401,
    message: 'Неправильный логин или пароль'
  })
})
