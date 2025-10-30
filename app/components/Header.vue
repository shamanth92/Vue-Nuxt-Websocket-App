<script setup lang="ts">
import { useGameStore } from "~/store/gameStore";
const router = useRouter();
const gameStore = useGameStore();

const userDetails = gameStore.setUserDetails;
console.log("userDetails Header: ", userDetails);

const routeToHome = () => {
  router.push("/home");
};
</script>
<template>
  <div class="p-5 flex items-center justify-between w-full bg-green-500">
    <!-- Center section wrapper -->
    <div class="absolute left-1/2 transform -translate-x-1/2">
      <button
        class="text-2xl font-extrabold font-serif text-white cursor-pointer"
        @click="routeToHome()"
      >
        Game Arcade
      </button>
    </div>

    <!-- Right section -->
    <div class="flex items-center gap-3 ml-auto">
      <div class="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
        <img
          :src="userDetails.picture"
          alt="Avatar"
          class="w-full h-full object-cover"
        />
      </div>
      <p class="text-white font-serif text-xl">{{ userDetails.name }}</p>
    </div>
  </div>
</template>
