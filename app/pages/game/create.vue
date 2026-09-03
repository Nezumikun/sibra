<script setup lang="ts">
import { LazyGameCreateSettingsModal, LazyCommonSelectPlayerModal } from '#components'
import type { GameCreateData } from '~/types/GameCreateData'
import type { PlayerInList } from '~/types/PlayerInList'
import { Place } from '~~/generated/prisma/enums'

enum EnumStage {
  SETTINGS,
  PLAYER_EAST,
  PLAYER_SOUTH,
  PLAYER_WEST,
  PLAYER_NORTH,
  FINISH
}

const stage = ref<EnumStage>(EnumStage.SETTINGS)
const data = ref<GameCreateData>({
  settings: {
    playerCount: 4,
    gameLimit: 10,
    emptyPlace: null,
    random: false
  },
  players: []
})

const players = (await $fetch('/api/player/list', {
  method: 'GET'
})).map<PlayerInList>((x) => {
  return {
    id: x.id,
    label: x.fullName + ' [' + x.name + ']'
  }
})

const overlay = useOverlay()

const modalSettings = overlay.create(LazyGameCreateSettingsModal)

async function openSettings() {
  const instanceSettings = modalSettings.open({
    settings: data.value.settings
  })

  const settingsResult = await instanceSettings.result
  if (settingsResult) {
    data.value.settings = settingsResult
    stage.value = EnumStage.PLAYER_EAST
  } else {
    stage.value = EnumStage.FINISH
    await navigateTo('/welcome')
  }
}

async function openSelectPLayer() {
  const modalPlayer = overlay.create(LazyCommonSelectPlayerModal)
  const instanceSelectPLayer = modalPlayer.open({
    place: '#' + (data.value.players.length + 1),
    players: players
  })

  const playerResult = await instanceSelectPLayer.result
  if (playerResult) {
    console.log(playerResult)
    const player = players.find(player => player.id === playerResult)
    if (player) {
      data.value.players.push({
        player: player,
        wind: null
      })
      stage.value = stage.value === EnumStage.PLAYER_EAST ? EnumStage.PLAYER_SOUTH : stage.value === EnumStage.PLAYER_SOUTH ? EnumStage.PLAYER_WEST : stage.value === EnumStage.PLAYER_WEST ? EnumStage.PLAYER_NORTH : EnumStage.FINISH
    }
  } else {
    stage.value = stage.value === EnumStage.PLAYER_EAST ? EnumStage.SETTINGS : stage.value === EnumStage.PLAYER_SOUTH ? EnumStage.PLAYER_EAST : stage.value === EnumStage.PLAYER_WEST ? EnumStage.PLAYER_SOUTH : EnumStage.PLAYER_WEST
  }
}

async function showStage() {
  console.log(stage.value)
  if (stage.value === EnumStage.SETTINGS) {
    await openSettings()
  } else {
    await openSelectPLayer()
  }
}

onMounted(async () => {
  while (stage.value !== EnumStage.FINISH) {
    await showStage()
  }
})
</script>

<template>
  <UContainer>
    <h1 class="font-bold text-xl py-4">
      Новая игра
    </h1>
    <div>
      Игроков: {{ data.settings.playerCount }}
    </div>
    <div>
      Рассадка: {{ data.settings.random ? 'Случайная' : 'Фиксированная' }}
    </div>
    <div>
      Количество сдач: {{ data.settings.gameLimit }}
    </div>
    <div
      v-if="data.settings.playerCount === 3"
    >
      Игрок отсутствует на {{ data.settings.emptyPlace === Place.SOUTH ? 'юге' : data.settings.emptyPlace === Place.WEST ? 'западе' : data.settings.emptyPlace === Place.NORTH ? 'севере' : '' }}
    </div>
  </UContainer>
</template>>
