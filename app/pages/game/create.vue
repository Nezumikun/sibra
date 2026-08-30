<script setup lang="ts">
import type { FormSubmitEvent, InputMenuItem } from '@nuxt/ui'
import * as z from 'zod'

// const { loggedIn, user, fetch } = useUserSession()

const players = (await $fetch('/api/player/list', {
  method: 'GET'
})).map((x) => {
  return {
    id: x.id,
    label: x.fullName + ' [' + x.name + ']'
  }
})
const items = ref<InputMenuItem[]>(players)

const schema = z.object({
  east: z.int().positive('Не выбран игрок'),
  south: z.int().positive('Не выбран игрок'),
  west: z.int().positive('Не выбран игрок'),
  north: z.int().positive('Не выбран игрок'),
  roundLimit: z.int().positive()
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  east: undefined,
  south: undefined,
  west: undefined,
  north: undefined,
  roundLimit: 4
})

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    await $fetch('/api/game/create', {
      method: 'POST',
      body: event.data
    })
    await navigateTo('/game/current')
  } catch (err) {
    console.log('Ошибка входа', err)
    toast.add({ title: 'Ошибка', description: 'Не удалось создать игру', color: 'error', duration: 2000 })
  }
}
</script>

<template>
  <UContainer>
    <h1 class="font-bold text-xl pt-4">
      Новая игра
    </h1>
    <UForm
      :schema="schema"
      :state="state"
      class="space-y-4"
      @submit.prevent="onSubmit($event)"
    >
      <UFormField
        label="東 Восток"
        name="east"
        class="pt-2"
      >
        <UInputMenu
          v-model="state.east"
          value-key="id"
          :items="items"
          class="w-full md:w-auto"
        />
      </UFormField>
      <UFormField
        label="南 Юг"
        name="south"
        class="pt-2"
      >
        <UInputMenu
          v-model="state.south"
          value-key="id"
          :items="items"
          class="w-full md:w-auto"
        />
      </UFormField>
      <UFormField
        label="西 Запад"
        name="west"
        class="pt-2"
      >
        <UInputMenu
          v-model="state.west"
          value-key="id"
          :items="items"
          class="w-full md:w-auto"
        />
      </UFormField>
      <UFormField
        label="北, Север"
        name="north"
        class="pt-2"
      >
        <UInputMenu
          v-model="state.north"
          value-key="id"
          :items="items"
          class="w-full md:w-auto"
        />
      </UFormField>
      <UButton
        type="submit"
        class="button-taiwanese p-2 w-full md:w-auto"
      >
        Начать игру
      </UButton>
    </UForm>
  </UContainer>
</template>>
