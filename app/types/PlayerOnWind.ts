import type { EnumWind } from './EnumPlace'
import type { Nullable } from './Nullable'
import type { PlayerInList } from './PlayerInList'

export interface PlayerOnWind {
  player: PlayerInList
  wind: Nullable<EnumWind>
}
