<script setup lang="ts">
import type { RoundEvent } from '~~/generated/prisma/client'
import Event from './Event.vue'

defineProps<{
  events: RoundEvent[]
  players: PlayerInList[]
}>()
</script>

<template>
  <div class="pt-4">
    <ul>
      <Event
        v-for="event in events"
        :key="event.id"
        :event="event"
        :players="players"
      />
    </ul>
  </div>
</template>
