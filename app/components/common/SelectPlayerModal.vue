<script setup lang="ts">
import type { FormError } from '@nuxt/ui'
import ErrorList from '~/components/common/ErrorList.vue'
import type { PlayerInList } from '~/types/PlayerInList'
import { SibraError } from '~/types/SibraError'

defineProps<{
  place: string
  players: PlayerInList[]
}>()

const errors = ref<SibraError[]>([])

const emit = defineEmits<{ close: [number | undefined] }>()

const value = ref<number | undefined>(undefined)

function validate(_data: Partial<number | undefined>): FormError[] {
  errors.value = []
  if (value.value === undefined) {
    errors.value = [
      new SibraError('Необходимо выбрать игрока')
    ]
  }
  return []
}

async function save() {
  emit('close', value.value)
}
</script>

<template>
  <UModal
    :close="false"
    :title="'Выберите игрока ' + place"
  >
    <template #body>
      <div>
        <UForm
          ref="form"
          class="w-full"
          :validate="validate"
        >
          <UInputMenu
            v-model="value"
            value-key="id"
            :items="players"
            class="w-full"
          />
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
          :disabled="typeof value === 'undefined'"
          @click="save()"
        />
      </div>
    </template>
  </UModal>
</template>
