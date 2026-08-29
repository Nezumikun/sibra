<template>
  <div class="flex flex-row gap-4">
    <div class="justify-center items-center">
      <div class="px-4 py-4 rounded-lg border-solid border-2 border-gray-300 text-7xl">
        <NuxtLink
          class="animated"
          to="/"
        >四<br>川</NuxtLink>
      </div>
    </div>
    <div>
      <div>
        <span class="text-3xl font-bold">S</span>
      </div>
      <div>
        <span class="text-3xl font-bold">I</span>chuan
      </div>
      <div>
        <span class="text-3xl font-bold">B</span>lood
      </div>
      <div>
        <span class="text-3xl font-bold">R</span>ules
      </div>
      <div>
        <span class="text-3xl font-bold">A</span>ssistant
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.animated {
  color: #CD3232;
  animation: fadein 2s ease-in-out;
}

@keyframes fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
