import type { Prisma } from '~~/generated/prisma/client'

export const gameWithIncludesArgs = {
  players: {
    omit: {
      gameId: true
    },
    include: {
      player: {
        select: {
          fullName: true,
          name: true
        }
      }
    }
  },
  rounds: {
    include: {
      events: {
        include: {
          children: true
        }
      }
    }
  }
}

const _gameWithIncludesArgs = {
  include: gameWithIncludesArgs
} satisfies Prisma.GameDefaultArgs

export type GameWithIncludes = Prisma.GameGetPayload<typeof _gameWithIncludesArgs>
