<script setup lang="ts">
import GuessMovieGame from "~/components/GuessMovieGame.vue";

useHead({
  title: "Lights, Camera, Guess!",
});

export interface Movie {
  name: string;
  img: string;
}
</script>

<template>
  <Header></Header>
  <GuessMovieGame />
</template>
