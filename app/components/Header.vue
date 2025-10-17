<script setup lang="ts">
const router = useRouter();

const routeToHome = () => {
  router.push("/");
};
</script>
<template>
  <div class="p-5 flex justify-center w-full bg-green-500">
    <button
      class="text-2xl font-extrabold font-serif text-white cursor-pointer"
      @click="routeToHome()"
    >
      Game Arcade
    </button>
  </div>
</template>
