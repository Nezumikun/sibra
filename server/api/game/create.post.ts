// import { number, z } from 'zod'
// import { Wind } from '~~/generated/prisma/enums'
import EnumWindToWind from '~~/server/utils/EnumWindToWind'
// import type { GameCreateData } from '~~/shared/types/GameCreateData'
// import { GameCreateSettings } from '~~/shared/types/GameCreateSettings'

// const numberEnum = <Num extends number, T extends Readonly<Num[]>>(
//   args: T
// ): z.ZodSchema<T[number]> => {
//   return z.custom<T[number]>((val: any) => args.includes(val))
// }

// const schemaGameCreateSettings: z.ZodType<GameCreateSettings> = z.object({
//   playersCount: numberEnum([4, 3]),
//   emptyPlace: z.instanceof(Nullable<Wind>),
//   random: z.boolean(),
//   roundLimit: numberEnum([1, 4, 8, 10, 16])
// })

// const schema: z.ZodType<GameCreateData> = z.object({
//   settings: schemaGameCreateSettings
// })

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  //  console.log(session)
  //  const gameParams = await readValidatedBody(event, schema.parse)
  const gameParams = await readBody(event) as GameCreateData

  if (session.user) {
    const game = await prisma.game.create({
      data: {
        createdById: session.user.id,
        roundLimit: gameParams.settings.roundLimit,
        playersCount: gameParams.settings.playersCount,
        players: {
          create: gameParams.players.filter(x => x.wind !== null).map(x => ({ playerId: x.player.id, initialPlace: EnumWindToWind(x.wind!) }))
        }
      }
    })
    session.currentGame = game
    await setUserSession(event, session)
  }
  return {}
})
