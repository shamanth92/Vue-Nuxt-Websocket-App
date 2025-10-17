<script setup lang="ts">
defineProps([
  "playerOne",
  "playerTwo",
  "playerOneWins",
  "playerTwoWins",
  "selectedOption",
  "endGame",
  "gameWinner",
]);

const emit = defineEmits<{
  (
    e: "finish-game",
    payload: { startNew: boolean; restartGame: boolean }
  ): void;
}>();

function startNewGame() {
  emit("finish-game", {
    startNew: true,
    restartGame: false,
  });
  localStorage.removeItem("ticTacToeState");
  localStorage.removeItem("ticTacToeWins");
  localStorage.removeItem("ticTacToeNum");
  localStorage.removeItem("ticTacToeWinsChild");
}

function restartOldGame() {
  emit("finish-game", {
    restartGame: true,
    startNew: false,
  });
}
</script>

<template>
  <div class="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
    <h2 class="text-2xl font-bold text-center text-gray-800 pb-6 font-serif">
      Score
    </h2>

    <div class="space-y-4">
      <div
        :class="[
          'flex justify-between text-lg font-medium px-4',
          endGame && gameWinner === playerOne ? 'text-green-500' : '',
        ]"
      >
        <p class="font-serif">{{ playerOne }}:</p>
        <p class="font-serif">{{ playerOneWins }}</p>
      </div>

      <div
        :class="[
          'flex justify-between text-lg font-medium px-4',
          endGame && gameWinner === playerTwo ? 'text-green-500' : '',
        ]"
      >
        <p class="font-serif">{{ playerTwo }}:</p>
        <p class="font-serif">{{ playerTwoWins }}</p>
      </div>
    </div>

    <div class="pt-4 text-green-500 font-serif" v-if="endGame">
      {{ `Congratulations! ${gameWinner} wins the game!` }}
    </div>
    <div class="font-serif flex items-center justify-center pt-5">
      {{ `(Best of ${selectedOption} games)` }}
    </div>

    <div class="flex justify-center pt-6" v-if="!endGame">
      <button
        class="bg-gray-500 hover:bg-gray-800 text-white px-6 py-2 rounded-lg shadow font-serif cursor-pointer"
        @click="startNewGame"
      >
        Start New Game
      </button>
    </div>
    <div class="flex flex-row gap-3 justify-center pt-6" v-if="endGame">
      <button
        class="bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded-lg shadow font-serif cursor-pointer"
        @click="startNewGame"
      >
        End Game
      </button>
      <button
        class="bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded-lg shadow font-serif cursor-pointer"
        @click="restartOldGame"
      >
        Restart
      </button>
    </div>
  </div>
</template>
