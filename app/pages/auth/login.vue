<script lang="ts" setup>
import { ref } from 'vue'
import * as z from 'zod'
import type { FetchError } from 'ofetch'
import type { FormSubmitEvent } from '@nuxt/ui'

const { fetch } = useUserSession()

const schema = z.object({
  email: z.email('Неправильный e-mail'),
  password: z.string('Обязательное поле').min(8, 'Должно быть не меньше 8 символов')
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  email: undefined,
  password: undefined
})

const pageData = ref({
  errorMessage: ''
})

async function login(event: FormSubmitEvent<Schema>) {
  console.log(event)
  const target = event.target as HTMLFormElement

  try {
    pageData.value.errorMessage = ''
    await $fetch('/api/login', {
      method: 'POST',
      body: {
        email: target.email.value,
        password: target.password.value
      }
    })
    await fetch()
    await navigateTo('/')
  } catch (ex) {
    pageData.value.errorMessage = (ex as FetchError).data.message
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <SiBRA />
    <div class="flex flex-col justify-center">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <UForm
          :schema="schema"
          :state="state"
          class="space-y-2"
          @submit.prevent="login($event)"
        >
          <UFormField
            label="Адрес электронной почты"
            name="email"
          >
            <UInput
              v-model="state.email"
              type="email"
              required
              autocomplete="email"
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="Пароль"
            name="password"
          >
            <UInput
              v-model="state.password"
              type="password"
              required
              autocomplete="current-password"
              class="w-full"
            />
          </UFormField>
          <UButton
            color="neutral"
            class="p-2 w-full"
            type="submit"
          >
            Войти
          </UButton>
          <UAlert
            v-if="pageData.errorMessage != ''"
            color="error"
            title="Ошибка"
            :description="pageData.errorMessage"
            variant="subtle"
            class="py-2 my-2"
          />
          <div class="flex items-center justify-between">
            <div class="block text-sm">
              Если у вас ещё нет учётной записи на сайте, воспользуйтесь <NuxtLink
                class="sibra"
                to="/auth/register"
              >страницей регистрации</NuxtLink>
            </div>
          </div>
        </UForm>
      </div>
    </div>
  </div>
</template>
