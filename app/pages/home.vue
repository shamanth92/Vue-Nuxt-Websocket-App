<script setup lang="ts">
import GameDisplay from "~/components/GameDisplay.vue";
import Header from "~/components/Header.vue";
import type { Movie } from "./guessthemovie.vue";
import { useGameStore } from "~/store/gameStore";

useHead({
  title: "Game Arcade",
});

const { data } = await useFetch<Movie[]>("/gameImages");
const gameStore = useGameStore();
const tictactoe = data.value?.find((i: Movie) => i.name === "tictactoe")?.img;
const memorygame = data.value?.filter((i: Movie) => i.name === "memorygame")[0]
  ?.img;
const guessthemovie = data.value?.filter(
  (i: Movie) => i.name === "guessthemovie"
)[0]?.img;

onMounted(() => {
  gameStore.socketEvents();
});
</script>

<template>
  <div class="h-screen bg-rose-50">
    <Header></Header>
    <p>
      Status:
      <span :class="gameStore.isConnected ? 'text-green-600' : 'text-red-600'">
        {{ gameStore.isConnected ? "Connected" : "Disconnected" }}
      </span>
    </p>
    <div class="p-5 flex justify-center w-full">
      <p class="text-lg font-extrabold font-serif">Select a game to play!</p>
    </div>
    <div class="flex w-full justify-around p-10">
      <GameDisplay
        name="Tic Tac Toe"
        route="/tictactoe"
        :imagePath="tictactoe"
      />
      <GameDisplay
        name="Mind Pairs"
        route="/mindPairs"
        :imagePath="memorygame"
      />
      <GameDisplay
        name="Lights, Camera, Guess!"
        route="/guessthemovie"
        :imagePath="guessthemovie"
      />
    </div>
  </div>
</template>

<style scoped></style>
