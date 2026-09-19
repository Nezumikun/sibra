<script setup lang="ts">
import type { CheckboxGroupItem, RadioGroupItem, FormError } from '@nuxt/ui'
import ErrorList from '~/components/common/ErrorList.vue'
import { SibraError } from '~/types/SibraError'
import type { RoundEvent } from '~~/generated/prisma/client'

const props = defineProps<{
  players: PlayerInList[]
  lastEvent: Nullable<RoundEvent>
}>()

const errors = ref<SibraError[]>([])

interface State {
  winners: string[]
  afterKong: boolean
  robbinKong: boolean
  victim: number
}

const state = ref<State>({
  winners: [],
  afterKong: false,
  robbinKong: false,
  victim: 0
})

const emit = defineEmits<{ close: [typeof state.value | undefined] }>()

const winnerItems = computed<CheckboxGroupItem[]>((): CheckboxGroupItem[] => {
  const result: CheckboxGroupItem[] = props.players
    // .filter(x => !state.value.winners.includes(x.id))
    .map(x => ({ value: x.id.toString(), label: x.label }))
  return result
})

const victimItems = computed<RadioGroupItem[]>((): RadioGroupItem[] => {
  const result: RadioGroupItem[] = props.players
    .filter(x => !state.value.winners.includes(x.id.toString()))
    .map(x => ({ value: x.id, label: x.label }))
  if (state.value.winners.length < 2) {
    result.push({
      value: -1,
      label: 'Со стены'
    })
  }
  return result
})

function validate(_data: Partial<typeof state.value | undefined>): FormError[] {
  errors.value = []
  if (state.value.winners.length === 0) {
    errors.value.push(new SibraError('Необходимо выбрать игроков, объявивших маджонг'))
  } else {
    if ((state.value.winners.length > 1) && (state.value.victim === -1)) {
      state.value.victim = 0
    }
    if (state.value.winners.length === props.players.length) {
      errors.value.push(new SibraError('Все не могут объявить маджонг'))
    } else if (state.value.victim === 0) {
      errors.value.push(new SibraError('Необходимо выбрать с кого взят конг'))
    }
  }
  console.log('validate', state.value)
  return []
}

async function save() {
  validate(state.value)
  if (errors.value.length === 0) {
    emit('close', state.value)
  }
}
</script>

<template>
  <UModal
    :close="false"
    title="Маджонг"
  >
    <template #body>
      <div>
        <UForm
          ref="form"
          class="w-full"
          :validate="validate"
        >
          <UFormField
            label="Кто объявил маджонг?"
            name="winner"
          >
            <UCheckboxGroup
              v-model="state.winners"
              :items="winnerItems"
            />
          </UFormField>
          <UFormField
            v-if="state.winners.length > 0"
            label="С кого?"
            name="victim"
            class="pt-2"
          >
            <URadioGroup
              v-model="state.victim"
              :items="victimItems"
            />
          </UFormField>
        </UForm>
        <ErrorList :errors="errors" />
      </div>
    </template>
    <template #footer>
      <div class="flex gap-2">
        <UButton
          color="neutral"
          label="Отменить"
          @click="emit('close', undefined)"
        />
        <UButton
          label="Применить"
          @click="save()"
        />
      </div>
    </template>
  </UModal>
</template>
