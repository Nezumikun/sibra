<script setup lang="ts">
</script>

<template>
  <nav class="shadow-lg w-full fixed top-0 h-15">
    <div class="flex items-center justify-between max-w-6xl mx-auto">
      <div class="space-x-7">
        <div
          to="/hand"
          class="flex items-center py-4 px-2"
        >
          <NuxtLink
            class="font-semibold text-lg sichuan-color"
            to="/"
          >
            四川
          </NuxtLink>
          <span class="font-semibold text-lg pl-2">
            SiBRA
          </span>
        </div>
      </div>
      <div class="px-2" />
    </div>
  </nav>
</template>

<style scoped>
nav {
  /* background-color: teal;*/
  z-index: 1000;
}
</style>
