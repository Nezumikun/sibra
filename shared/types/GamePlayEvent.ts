import type { RoundEventType } from '~~/generated/prisma/enums'

export interface GamePlayEvent {
  type: RoundEventType
  player: number
  victim: number
}
