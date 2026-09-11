import type { Nullable } from './Nullable'
import type { EnumWind } from './EnumWind'

export interface GameCreateSettings {
  playerCount: 3 | 4
  gameLimit: 1 | 4 | 8 | 10 | 16
  random: boolean
  emptyPlace: Nullable<EnumWind>
}
