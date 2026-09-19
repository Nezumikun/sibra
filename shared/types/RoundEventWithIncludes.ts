import type { Prisma } from '~~/generated/prisma/client'

const _roundEventWithIncludesArgs = {
  include: {
    children: true
  }
} satisfies Prisma.RoundEventDefaultArgs

export type RoundEventWithIncludes = Prisma.RoundEventGetPayload<typeof _roundEventWithIncludesArgs>
