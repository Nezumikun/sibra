<script lang="ts" setup>
const { loggedIn, user, session } = useUserSession()
// const { loggedIn, user, session, fetch } = useUserSession()
// const nuxtApp = useNuxtApp()

// async function updateSession(nuxtApp: NuxtApp) {
//   await nuxtApp.runWithContext(async () => {
//     if (loggedIn) {
//       console.log('Надо бы обновить сессию', new Date())
//       try {
//         await $fetch('/api/session/update', {
//           method: 'GET'
//         })
//         await fetch()
//         console.log(session.value)
//       } catch (err) {
//         console.log(err)
//       }
//     }
//   })
//   // setTimeout(updateSession, 10 * 1000)
// }

// await updateSession(nuxtApp)
</script>

<template>
  <div class="flex flex-col gap-4">
    <SiBRA />
    <div class="flex w-full">
      <div
        v-if="loggedIn && user && session"
        class="flex flex-col w-full gap-y-2"
      >
        <div class="w-full text-center">
          Добро пожаловать, {{ user.name ?? "" }}!
        </div>
        <UButton
          v-if="session.currentGame"
          color="neutral"
          class="p-2"
          to="/game/current"
        >
          Вернуться в игру
        </UButton>
        <UButton
          v-else
          color="neutral"
          class="p-2"
          to="/game/create"
        >
          Начать игру
        </UButton>
        <UButton
          color="neutral"
          class="p-2"
          to="/auth/logout"
        >
          Выйти
        </UButton>
      </div>
      <div
        v-else
        class="flex flex-col w-full gap-y-1 text-center"
      >
        <UButton
          color="neutral"
          class="p-2"
          to="/auth/login"
        >
          Войти
        </UButton>
        <UButton
          color="neutral"
          class="p-2"
          to="/auth/register"
        >
          Зарегистрироваться
        </UButton>
      </div>
    </div>
  </div>
</template>
