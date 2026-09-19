<script setup lang="ts">
import Event from './Event.vue'

const props = defineProps<{
  events: RoundEventWithIncludes[]
  players: PlayerInList[]
  allowDelete: boolean
}>()

const emit = defineEmits<{
  deleteEvent: [id: number]
}>()

async function deleteEvent(id: number) {
  emit('deleteEvent', id)
}

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
        :allow-delete="allowDelete && index === 0"
        @delete-event="deleteEvent"
      />
    </ul>
  </div>
</template>
