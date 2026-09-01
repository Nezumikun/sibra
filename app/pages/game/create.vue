<script setup lang="ts">
import { LazyGameCreateSettingsModal } from '#components'
import type { GameCreateSettings } from '~/types/GameCreateSettings'
import { Place } from '~~/generated/prisma/enums'

const settings = ref<GameCreateSettings>({
  playerCount: 4,
  gameLimit: 10,
  emptyPlace: null,
  random: false
})

const overlay = useOverlay()

const modal = overlay.create(LazyGameCreateSettingsModal)

async function open() {
  const instance = modal.open({
    settings: settings.value
  })

  const settingsReult = await instance.result
  if (settingsReult) {
    settings.value = settingsReult
  }
}
onMounted(async () => {
  await open()
})
</script>

<template>
  <UContainer>
    <h1 class="font-bold text-xl py-4">
      Новая игра
    </h1>
    <div>
      Игроков: {{ settings.playerCount }}
    </div>
    <div>
      Рассадка: {{ settings.random ? 'Случайная' : 'Фиксированная' }}
    </div>
    <div>
      Колличество сдач: {{ settings.gameLimit }}
    </div>
    <div
      v-if="settings.playerCount === 3"
    >
      Игрок отсутсвует на {{ settings.emptyPlace === Place.EAST ? 'востоке' : settings.emptyPlace === Place.SOUTH ? 'юге' : settings.emptyPlace === Place.WEST ? 'западе' : settings.emptyPlace === Place.NORTH ? 'севере' : '' }}
    </div>
  </UContainer>
</template>>
