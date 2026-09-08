<script setup lang="ts">
import { LazyGameCreateSettingsModal, LazyCommonSelectPlayerModal } from '#components'
import { EnumWind } from '~/types/EnumWind'
import type { GameCreateData } from '~/types/GameCreateData'
import type { PlayerInList } from '~/types/PlayerInList'

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

const playerPlace = ref<string>('')

async function openSelectPLayer() {
  if (!(data.value.settings.playerCount === 3
    && (data.value.settings.emptyPlace === EnumWind.SOUTH && stage.value === EnumStage.PLAYER_SOUTH)
  )) {
    const modalPlayer = overlay.create(LazyCommonSelectPlayerModal)
    playerPlace.value = data.value.settings.random
      ? '#' + (data.value.players.length + 1)
      : stage.value === EnumStage.PLAYER_EAST
        ? 'на востоке'
        : stage.value === EnumStage.PLAYER_SOUTH
          ? 'на юге'
          : stage.value === EnumStage.PLAYER_WEST
            ? 'на западе'
            : stage.value === EnumStage.PLAYER_NORTH
              ? 'на севере'
              : ''
    const playersInGame = data.value.players.map(x => x.player.id)
    const instanceSelectPLayer = modalPlayer.open({
      place: playerPlace.value,
      players: players.filter(x => !playersInGame.includes(x.id))
    })

    const playerResult = await instanceSelectPLayer.result
    if (playerResult) {
      const player = players.find(player => player.id === playerResult)
      if (player) {
        data.value.players.push({
          player: player,
          wind: data.value.settings.random
            ? null
            : stage.value === EnumStage.PLAYER_EAST
              ? EnumWind.EAST
              : stage.value === EnumStage.PLAYER_SOUTH
                ? EnumWind.SOUTH
                : stage.value === EnumStage.PLAYER_WEST
                  ? EnumWind.WEST
                  : EnumWind.NORTH
        })
      }
    } else {
      stage.value = stage.value === EnumStage.PLAYER_EAST ? EnumStage.SETTINGS : stage.value === EnumStage.PLAYER_SOUTH ? EnumStage.PLAYER_EAST : stage.value === EnumStage.PLAYER_WEST ? EnumStage.PLAYER_SOUTH : EnumStage.PLAYER_WEST
      return
    }
  }
  stage.value = stage.value === EnumStage.PLAYER_EAST ? EnumStage.PLAYER_SOUTH : stage.value === EnumStage.PLAYER_SOUTH ? EnumStage.PLAYER_WEST : stage.value === EnumStage.PLAYER_WEST ? EnumStage.PLAYER_NORTH : EnumStage.FINISH
}

async function showStage() {
  if (stage.value === EnumStage.SETTINGS) {
    await openSettings()
  } else {
    await openSelectPLayer()
  }
}

const GoAway = ref<boolean>(false)

function fisherYatesShuffle(arr: EnumWind[]): EnumWind[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j: number = (Math.floor(Math.random() * (i + 1)));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!]
  }
  return arr
}
function shuffleWinds() {
  const winds: EnumWind[] = [EnumWind.EAST]
  if (data.value.settings.emptyPlace !== EnumWind.SOUTH) winds.push(EnumWind.SOUTH)
  if (data.value.settings.emptyPlace !== EnumWind.WEST) winds.push(EnumWind.WEST)
  if (data.value.settings.emptyPlace !== EnumWind.NORTH) winds.push(EnumWind.NORTH)
  return fisherYatesShuffle(winds)
}

onMounted(async () => {
  while (stage.value !== EnumStage.FINISH) {
    if (GoAway.value) return
    await showStage()
  }
  console.log(data.value)
  if (data.value.settings.random) {
    const winds = shuffleWinds()
    console.log(winds)
  }
})
onUnmounted(async () => {
  GoAway.value = true
})
</script>

<template>
  <UContainer>
    <h1 class="font-bold text-xl py-4">
      Новая игра
    </h1>
    <div v-if="stage !== EnumStage.SETTINGS">
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
        Игрок отсутствует на {{ data.settings.emptyPlace === EnumWind.SOUTH ? 'юге' : data.settings.emptyPlace === EnumWind.WEST ? 'западе' : data.settings.emptyPlace === EnumWind.NORTH ? 'севере' : '' }}
      </div>
    </div>
    <div
      v-if="stage !== EnumStage.FINISH"
      class="pt-4"
    >
      Этап: {{ stage === EnumStage.SETTINGS ? 'Основные настройки' : ('Выбор игрока ' + playerPlace) }}
    </div>
  </UContainer>
</template>>
