<script setup lang="ts">
import { XCircleIcon } from "@heroicons/vue/16/solid";
import { ArrowLongRightIcon, ArrowPathIcon } from "@heroicons/vue/20/solid";
import { useGuessTheMovie } from "#imports";

const {
  currentLevel,
  currentQuestion,
  quizMovies,
  shuffled,
  addLetter,
  usedLetters,
  highlightAnswer,
  showRed,
  moveLetters,
  moveForward,
  restartLevel,
  moveToNextLevel,
} = useGuessTheMovie();
</script>

<template>
  <!-- <form novalidate>
          <div class="flex justify-center w-120 flex-wrap">
            <div v-for="(movie, i) in shuffled" :key="movie" class="pr-3 pb-3">
              <input
                type="text"
                v-model="nameLetter[i]"
                class="border p-2 rounded font-serif w-10 bg-white border-cyan-500 text-center"
                maxlength="1"
                @input="convertUppercase($event, i)"
              />
            </div>
          </div>
        </form> -->
  <div class="h-screen bg-rose-50 p-5 flex flex-col items-center">
    <p class="text-2xl font-bold font-serif">{{ currentLevel }} Level</p>

    <div class="pt-10 flex flex-col items-center gap-10">
      <img :src="quizMovies?.[currentQuestion]?.img" class="h-100 w-80" />

      <!-- Answer boxes -->
      <div class="flex justify-center w-120 flex-wrap">
        <div v-for="(letter, i) in addLetter" :key="i" class="pr-3 pb-3">
          <div
            v-if="quizMovies?.[currentQuestion]?.name[i] === ' '"
            class="w-10"
          ></div>
          <button
            v-else
            :class="[
              'h-10 w-10 border-2 border-cyan-500 rounded-md font-bold font-serif text-xl',
              highlightAnswer
                ? 'bg-green-500 text-white'
                : showRed
                ? 'bg-red-500 text-white'
                : 'bg-white',
            ]"
          >
            {{ letter.toUpperCase() }}
          </button>
        </div>
      </div>

      <!-- Option letters -->
      <div class="flex justify-center w-120 flex-wrap">
        <div v-for="(letter, i) in shuffled" :key="i" class="pr-3 pb-3">
          <button
            :class="[
              'h-10 w-10 border-2 border-cyan-500 rounded-md font-bold font-serif text-xl cursor-pointer',
              usedLetters.includes(i) ? 'bg-gray-400 text-white' : 'bg-white',
            ]"
            :disabled="usedLetters.includes(i)"
            @click="moveLetters(letter, i)"
          >
            {{ letter.toUpperCase() }}
          </button>
        </div>
      </div>

      <!-- Controls -->
      <div class="flex justify-center gap-8 mt-8">
        <XCircleIcon class="size-10 text-red-500 cursor-pointer" />
        <ArrowPathIcon
          class="size-10 text-blue-500 cursor-pointer"
          @click="restartLevel"
        />
        <ArrowLongRightIcon
          v-if="highlightAnswer && currentQuestion !== 4"
          class="size-10 text-green-500 cursor-pointer"
          @click="moveForward"
        />
        <button
          v-if="highlightAnswer && currentQuestion === 4"
          class="bg-green-500 text-white font-serif rounded-md border-2 border-green-500 p-2 cursor-pointer"
          @click="moveToNextLevel"
        >
          Move to Next Level
        </button>
      </div>
    </div>
  </div>
</template>
