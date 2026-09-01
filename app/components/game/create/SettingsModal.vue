<script setup lang="ts">
import type { FormError, FormSubmitEvent, RadioGroupItem } from '@nuxt/ui'
import type { GameCreateSettings } from '~/types/GameCreateSettings'
import type { Nullable } from '~/types/Nullable'
import { Place } from '~~/generated/prisma/enums'

const props = defineProps<{
  settings: GameCreateSettings
}>()

const playerCountItems = ref(['3', '4'])
const gameCountItems = ref(['1', '4', '8', '10', '16'])
const placeItems = ref<RadioGroupItem[]>([
  {
    label: '東 Восток',
    value: 'EAST'
  },
  {
    label: '南 Юг',
    value: 'SOUTH'
  },
  {
    label: '西 Запад',
    value: 'WEST'
  },
  {
    label: '北 Север',
    value: 'NORTH'
  }
])

const emit = defineEmits<{ close: [Nullable<GameCreateSettings>] }>()

interface stateInterface {
  playerCount: string
  random: boolean
  gameLimit: string
  emptyPlace: string | null
}

const state = ref<stateInterface>({
  playerCount: props.settings.playerCount.toString(),
  random: props.settings.random,
  gameLimit: props.settings.gameLimit.toString(),
  emptyPlace: props.settings.emptyPlace ? props.settings.emptyPlace.toString() : null
})

type Schema = typeof state

async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log('onSubmit', event.data)
  save()
}

function validate(data: Partial<stateInterface>): FormError[] {
  const errors = []
  console.log('validate', data)
  if (data.playerCount === '3' && data.emptyPlace == null) errors.push({ name: 'emptyPlace', message: 'Required' })
  // if (!state.password) errors.push({ name: 'password', message: 'Required' })
  console.log(errors)
  return errors
}

async function save() {
  const value: GameCreateSettings = {
    playerCount: state.value.playerCount === '3' ? 3 : 4,
    gameLimit: state.value.gameLimit === '16' ? 16 : state.value.gameLimit === '10' ? 10 : state.value.gameLimit === '8' ? 8 : state.value.gameLimit === '4' ? 4 : 1,
    random: state.value.random!,
    emptyPlace: state.value.playerCount === '4' ? null : state.value.emptyPlace === 'EAST' ? Place.EAST : state.value.emptyPlace === 'SOUTH' ? Place.SOUTH : state.value.emptyPlace === 'WEST' ? Place.WEST : state.value.emptyPlace === 'NORTH' ? Place.NORTH : null
  }
  console.log('save ', value)
  emit('close', value)
}
</script>

<template>
  <UModal
    :close="false"
    title="Основные настройки"
  >
    <template #body>
      <div>
        <UForm
          ref="form"
          class="w-full"
          :state="state"
          :validate="validate"
          @submit="onSubmit"
        >
          <UFormField
            label="Количество игроков"
            name="playerCount"
          >
            <URadioGroup
              v-model="state.playerCount"
              :items="playerCountItems"
              orientation="horizontal"
            />
          </UFormField>
          <UFormField
            v-if="state.playerCount === '3'"
            label="На каком месте нет игрока?"
            name="emptyPlace"
          >
            <URadioGroup
              v-model="state.emptyPlace"
              :items="placeItems"
              orientation="horizontal"
            />
          </UFormField>
          <UFormField
            label="Количество сдач"
            name="gameLimit"
          >
            <URadioGroup
              v-model="state.gameLimit"
              :items="gameCountItems"
              orientation="horizontal"
            />
          </UFormField>
        </UForm>
        <div>
          Игроков: {{ state.playerCount }}
        </div>
        <div>
          Рассадка: {{ settings.random ? 'Случайная' : 'Фиксированная' }}
        </div>
        <div
          v-if="state.playerCount === '3'"
        >
          Игрок отсутствует на {{ state.emptyPlace }} {{ state.emptyPlace === Place.EAST ? 'востоке' : state.emptyPlace === Place.SOUTH ? 'юге' : settings.emptyPlace === Place.WEST ? 'западе' : settings.emptyPlace === Place.NORTH ? 'севере' : '' }}
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex gap-2">
        <UButton
          color="neutral"
          label="Отменить"
          @click="emit('close', null)"
        />
        <UButton
          type="submit"
          label="Применить"
        />
      </div>
    </template>
  </UModal>
</template>
