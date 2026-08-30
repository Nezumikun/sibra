<script lang="ts" setup>
import { ref } from 'vue'
import type { FetchError } from 'ofetch'

const { loggedIn, session } = useUserSession()
const route = useRoute()
const data = ref({
  errorMessage: ''
})

async function Update() {
  data.value.errorMessage = ''
  if (loggedIn.value) {
    try {
      const game = await $fetch(`/api/game/${route.params.uuid}/state`)
      console.log(game)
    } catch (ex) {
      const error = (ex as FetchError).data
      data.value.errorMessage = error.message
    }
  } else {
    console.log('Goto /')
    await navigateTo('/')
  }
}

Update()
</script>

<template>
  <div>
    <UAlert
      v-if="data.errorMessage != ''"
      color="error"
      title="Ошибка"
      :description="data.errorMessage"
    />
    <div
      v-if="loggedIn"
      class="text-center"
    >
      {{ session?.currentGame.uuid }}
    </div>
  </div>
</template>>
