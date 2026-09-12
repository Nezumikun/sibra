<script lang="ts" setup>
const { loggedIn, session, fetch } = useUserSession()

if (loggedIn) {
  await fetch()
  navigateTo(`/game/${session.value?.currentGame.uuid}`)
} else {
  navigateTo('/')
}
</script>

<template>
  <div class="text-center" />
</template>>
