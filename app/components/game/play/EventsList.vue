<script setup lang="ts">
import type { RoundEvent } from '~~/generated/prisma/client'
import Event from './Event.vue'

const props = defineProps<{
  events: RoundEvent[]
  players: PlayerInList[]
  allowDelete: boolean
}>()

const sortedEvents = computed(() => [...props.events].sort((a, b) => b.id - a.id))
</script>

<template>
  <div class="pt-4">
    <ul>
      <Event
        v-for="(event, index) in sortedEvents"
        :key="event.id"
        :event="event"
        :index="index"
        :players="players"
        :allow-delete="allowDelete"
      />
    </ul>
  </div>
</template>
