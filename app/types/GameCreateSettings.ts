import type { Place } from '~~/generated/prisma/enums'
import type { Nullable } from './Nullable'

export interface GameCreateSettings {
  playerCount: 3 | 4
  gameLimit: 1 | 4 | 8 | 10 | 16
  random: boolean
  emptyPlace: Nullable<Place>
}
