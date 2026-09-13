<script setup lang="ts">
import type { RadioGroupItem, FormError } from '@nuxt/ui'
import ErrorList from '~/components/common/ErrorList.vue'
import { SibraError } from '~/types/SibraError'

const props = defineProps<{
  players: PlayerInList[]
}>()

const errors = ref<SibraError[]>([])

const state = ref({
  player: 0,
  victim: 0
})

const emit = defineEmits<{ close: [typeof state.value | undefined] }>()

const victimItems = computed<RadioGroupItem[]>((): RadioGroupItem[] => {
  const result: RadioGroupItem[] = props.players
    .filter(x => x.id !== state.value.player)
    .map(x => ({ value: x.id, label: x.label }))
  result.push({
    value: state.value.player,
    label: 'Доставленный конг'
  })
  result.push({
    value: -1,
    label: 'Со стены'
  })
  return result
})

function validate(_data: Partial<typeof state.value | undefined>): FormError[] {
  errors.value = []
  if (state.value.player === 0) {
    errors.value.push(new SibraError('Необходимо выбрать игрока, который объявил конг'))
  }
  if (state.value.victim === 0) {
    errors.value.push(new SibraError('Необходимо выбрать с кого взят конг'))
  }
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
    title="Конг"
  >
    <template #body>
      <div>
        <UForm
          ref="form"
          class="w-full"
          :validate="validate"
        >
          <UFormField
            label="Кто объявил конг?"
            name="player"
          >
            <URadioGroup
              v-model="state.player"
              :items="players"
              value-key="id"
            />
          </UFormField>
          <UFormField
            v-if="state.player !== 0"
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
