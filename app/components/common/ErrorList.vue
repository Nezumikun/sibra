<script setup lang="ts">
import type { SibraError } from '~/types/SibraError'

defineProps<{
  errors: SibraError[]
}>()
</script>

<template>
  <div class="pt-4">
    <UAlert
      v-for="item in errors"
      :key="item.id"
      color="error"
      variant="subtle"
      :title="item.message"
    />
  </div>
</template>
