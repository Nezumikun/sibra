export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (session.user) {
    const currentGame = await prisma.game.findFirst({
      select: {
        players: {
          where: {
            playerId: session.user.id
          }
        }
      }
    })
    if (currentGame) {
      console.log(currentGame)
    }
  }
  console.log(session)
})
