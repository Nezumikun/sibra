<script setup lang="ts">
import type { RoundEvent } from '~~/generated/prisma/client'

const props = defineProps<{
  event: RoundEvent
  players: PlayerInList[]
}>()

function getPlayerNameById(id: number) {
  const player = props.players.find(x => x.id === id)
  if (player) {
    return player.label
  } else {
    return 'Неизвестный игрок'
  }
}
</script>

<template>
  <li>
    <span v-if="event.type === 'START'"> {{ getPlayerNameById(event.createdById) }} дилер</span>
  </li>
</template>
