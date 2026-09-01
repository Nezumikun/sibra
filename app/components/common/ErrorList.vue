<script setup lang="ts">
const props = defineProps<{
  errors: string[]
}>()
</script>

<template>
  <div class="pt-4">
    <UAlert
      v-for="(item, index) in errors"
      color="error"
      variant="subtle"
      :title="item"
    />
  </div>
</template>