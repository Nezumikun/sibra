import type { GameCreateSettings } from './GameCreateSettings'
import type { PlayerOnWind } from './PlayerOnWind'

export interface GameCreateData {
  settings: GameCreateSettings
  players: PlayerOnWind[]
}
