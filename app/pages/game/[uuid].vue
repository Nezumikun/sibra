<script lang="ts" setup>
import { ref } from 'vue'
import type { FetchError } from 'ofetch'
import { SibraError } from '~/types/SibraError'
import ErrorList from '~/components/common/ErrorList.vue'
import type { Prisma } from '~~/generated/prisma/client'
import EventsList from '~/components/game/play/EventsList.vue'
import { LazyGamePlayKongModal } from '#components'
import type { GamePlayEvent } from '~~/shared/types/GamePlayEvent'

const { loggedIn } = useUserSession()
const route = useRoute()

const _gameWithIncludesArgs = {
  include: {
    players: {
      include: {
        player: {
          select: {
            fullName: true,
            name: true
          }
        }
      }
    },
    rounds: {
      include: {
        events: true
      }
    }
  }
} satisfies Prisma.GameDefaultArgs

type GameWithIncludes = Prisma.GameGetPayload<typeof _gameWithIncludesArgs>

const errors = ref<SibraError[]>([])
const game = ref<GameWithIncludes | null>(null)
const players = ref<PlayerInList[]>([])
const loading = ref<boolean>(false)

async function update() {
  loading.value = true
  errors.value = []
  if (loggedIn.value) {
    try {
      const state = await $fetch<GameWithIncludes>(`/api/game/${route.params.uuid}/state`)
      console.log(state)
      game.value = state
      players.value = state.players.map(x => ({
        id: x.playerId,
        label: x.player.fullName + ' [' + x.player.name + ']'
      }))
    } catch (ex) {
      const error = (ex as FetchError).data
      errors.value.push(new SibraError(error.message))
    }
    loading.value = false
  } else {
    await navigateTo('/')
  }
}

async function save(data: GamePlayEvent) {
  try {
    errors.value = []
    await $fetch(`/api/game/${game.value?.uuid}/event`, {
      method: 'POST',
      body: data
    })
    await update()
  } catch (ex) {
    errors.value.push(new SibraError((ex as FetchError).data.message))
  }
}

const overlay = useOverlay()

const modalKong = overlay.create(LazyGamePlayKongModal)

async function kong() {
  const instanceKong = modalKong.open({
    players: players.value
  })

  const kongResult = await instanceKong.result
  if (kongResult) {
    console.log('kongResult', kongResult)
    const data: GamePlayEvent = {
      type: 'KONG',
      player: kongResult.player,
      victim: kongResult.victim
    }
    save(data)
  }
}

update()
</script>

<template>
  <div>
    <div
      v-if="loggedIn && game"
      class=""
    >
      <div
        v-for="round in game.rounds.sort((a, b) => a.number - b.number)"
        :key="round.id"
      >
        <div class="font-bold">
          Раунд #{{ round.number }}
        </div>
        <div
          v-if="!game.finished"
        >
          <div
            v-if="loading"
          >
            Идёт обновление данных...
          </div>
          <div
            class="flex flex-col gap-2 sm:flex-row pt-4"
          >
            <UButton
              color="neutral"
            >
              Маджонг
            </UButton>
            <UButton
              color="neutral"
              @click="kong"
            >
              Конг
            </UButton>
            <UButton
              color="neutral"
            >
              Стена закончилась
            </UButton>
          </div>
          <EventsList
            :events="round.events"
            :players="players"
          />
        </div>
      </div>
    </div>
    <ErrorList :errors="errors" />
  </div>
</template>>
