<script lang="ts" setup>
const { loggedIn, session } = useUserSession()

if (loggedIn) {
  navigateTo(`/game/${session.value?.currentGame.uuid}`)
} else {
  navigateTo('/')
}
</script>

<template>
  <div class="text-center" />
</template>>
