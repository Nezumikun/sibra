<script setup lang="ts">
import type { RoundEvent } from '~~/generated/prisma/client'

const props = defineProps<{
  event: RoundEvent
  players: PlayerInList[]
  index: number
}>()

function getPlayerNameById(id: number) {
  const player = props.players.find(x => x.id === id)
  if (player) {
    return player.label
  } else {
    return 'Неизвестный игрок'
  }
}

const playerName = getPlayerNameById(props.event.createdById)
const victimName = props.event.victimPlayerId === null ? '' : getPlayerNameById(props.event.victimPlayerId)
</script>

<template>
  <li>
    <span v-if="event.type === 'START'"> {{ playerName }} дилер</span>
    <span v-else-if="event.type === 'KONG'"> {{ playerName }}: {{ event.victimPlayerId === event.createdById ? 'доставленный конг' : event.victimPlayerId === null ? 'конг со стены' : ('конг с ' + victimName) }}</span>
    <span v-else> Неизвестный тип события {{ JSON.stringify(event) }}</span>
  </li>
</template>
