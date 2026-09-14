<script setup lang="ts">
import type { RoundEvent } from '~~/generated/prisma/client'

const props = defineProps<{
  event: RoundEvent
  players: PlayerInList[]
  index: number
  allowDelete: boolean
}>()

function getPlayerNameById(id: number) {
  const player = props.players.find(x => x.id === id)
  if (player) {
    return player.label
  } else {
    return 'Неизвестный игрок'
  }
}

const emit = defineEmits<{
  deleteEvent: [id: number]
}>()

async function deleteEvent(id: number) {
  emit('deleteEvent', id)
}

const playerName = getPlayerNameById(props.event.createdById)
const victimName = props.event.victimPlayerId === null ? '' : getPlayerNameById(props.event.victimPlayerId)
</script>

<template>
  <UCard
    class="rounded-none text-sm"
  >
    <div class="flex flex-row">
      <div class="flex flex-col grow">
        <div class="font-bold">
          {{ playerName }}
        </div>
        <div>
          <span v-if="event.type === 'START'">Дилер</span>
          <span v-else-if="event.type === 'KONG'">{{ event.victimPlayerId === event.createdById ? 'Доставленный конг' : event.victimPlayerId === null ? 'Конг со стены' : ('Конг с ' + victimName) }}</span>
          <span v-else> Неизвестный тип события {{ JSON.stringify(event) }}</span>
        </div>
      </div>
      <div
        v-if="allowDelete"
        class=""
      >
        <UButton
          variant="outline"
          color="neutral"
          icon="i-lucide-trash-2"
          @click="deleteEvent(event.id)"
        />
      </div>
    </div>
  </UCard>
</template>
