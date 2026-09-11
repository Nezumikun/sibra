import type { Nullable } from './Nullable'
import type { EnumWind } from './EnumWind'

export interface GameCreateSettings {
  playersCount: 3 | 4
  roundLimit: 1 | 4 | 8 | 10 | 16
  random: boolean
  emptyPlace: Nullable<EnumWind>
}
