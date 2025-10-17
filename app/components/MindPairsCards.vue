<script setup lang="ts">
import { XCircleIcon } from "@heroicons/vue/16/solid";
import { ArrowLongRightIcon, ArrowPathIcon } from "@heroicons/vue/20/solid";
import type { Movie } from "./../pages/guessthemovie.vue";
import {
  useShuffledArray,
  useGetAllImages,
  useMoveForward,
} from "@/composables/shuffleCardPairs";

const images = ref();

const { currentLevel, levelNumber, winCards, shuffledCards, moveForward } =
  useMoveForward(images);

const boxes = ref<boolean[]>(Array(levelNumber.value).fill(false));

onMounted(async () => {
  const { data } = await useFetch<Movie[]>("/gameImages");
  images.value = data.value;
  const { imageOne, imageTwo, imageThree } = useGetAllImages(images.value);
  shuffledCards.value = useShuffledArray([
    imageOne,
    imageTwo,
    imageThree,
  ]).value;
});

watch(levelNumber, () => {
  boxes.value = Array(levelNumber.value).fill(false);
});

const openCard = (index: number) => {
  boxes.value[index] = !boxes.value[index];
  setTimeout(() => {
    if (boxes.value.filter((b) => b).length === 2) {
      const trueIndices: number[] = boxes.value.reduce<number[]>(
        (acc, val, i) => {
          if (val) acc.push(i);
          return acc;
        },
        []
      );
      if (
        shuffledCards.value[trueIndices[0]].value ===
        shuffledCards.value[trueIndices[1]].value
      ) {
        trueIndices.forEach((t) => {
          winCards.value[t] = true;
        });
      }
      boxes.value.forEach((_, i) => (boxes.value[i] = false));
    }
  }, 600);
};

const gameWon = computed(() => winCards.value.every(Boolean));

const gridMap: Record<number, string> = {
  1: "grid grid-cols-2",
  2: "grid grid-cols-3",
  3: "grid grid-cols-6",
};

const gridClass = computed(
  () => gridMap[currentLevel.value] || "grid grid-cols-2"
);
</script>

<template>
  <div class="h-screen bg-rose-50 p-5">
    <div class="flex w-full justify-center">
      <p class="text-2xl font-bold font-serif">Level {{ currentLevel }}</p>
    </div>
    <div class="flex flex-col gap-15">
      <div class="flex w-full justify-center pt-10">
        <div :class="gridClass">
          <div v-for="(item, n) in boxes" :key="n" class="p-3">
            <button
              :class="[
                'h-32 w-32 rounded-lg cursor-pointer overflow-hidden',
                winCards[n] ? 'bg-green-500' : 'bg-orange-500',
              ]"
              @click="openCard(n)"
              :disabled="winCards[n]"
            >
              <Transition
                enter-active-class="transition-transform duration-500 ease-out"
                enter-from-class="translate-y-full"
                enter-to-class="translate-y-0"
                leave-active-class="transition-transform duration-500 ease-in"
                leave-from-class="translate-y-0"
                leave-to-class="translate-y-full"
              >
                <img
                  :src="shuffledCards[n]?.value"
                  class="h-30 w-30 rounded-lg"
                  v-if="boxes[n] === true"
                />
              </Transition>
            </button>
          </div>
        </div>
      </div>

      <div class="flex w-full justify-center gap-8">
        <XCircleIcon class="size-10 text-red-500 cursor-pointer" />
        <ArrowPathIcon class="size-10 text-blue-500 cursor-pointer" />
        <ArrowLongRightIcon
          class="size-10 text-green-500 cursor-pointer"
          v-if="gameWon"
          @click="moveForward()"
        />
      </div>
    </div>
  </div>
</template>
