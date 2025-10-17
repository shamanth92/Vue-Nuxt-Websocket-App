<script setup lang="ts">
defineProps(["name", "route", "imagePath"]);
</script>

<template>
  <div class="flex flex-col gap-4">
    <img :src="imagePath" class="h-80 w-80" />
    <p class="font-serif font-bold text-lg flex justify-center">{{ name }}</p>
    <NuxtLink :to="route"
      ><button
        class="text-white bg-green-500 px-10 h-12 w-80 rounded-lg border-2 border-green-500 cursor-pointer font-serif font-bold"
      >
        Play
      </button></NuxtLink
    >
  </div>
</template>
