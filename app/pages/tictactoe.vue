<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import confetti from "canvas-confetti";
import TicTacToeGame from "~/components/TicTacToeGame.vue";
import ScoreBoard from "~/components/ScoreBoard.vue";
import Header from "~/components/Header.vue";

useHead({
  title: "Tic Tac Toe",
});

const playerOne = ref("");
const playerTwo = ref("");
const startGameOption = ref(false);

const playerOneWins = ref(0);
const playerTwoWins = ref(0);

const selectedOption = ref("");

const gameWinner = ref("");

const endGame = ref(false);

const startNew = ref(false);

const restartGame = ref(false);

onMounted(() => {
  const savedState = localStorage.getItem("ticTacToeState");
  const winState = localStorage.getItem("ticTacToeWins");
  const numState = localStorage.getItem("ticTacToeNum");
  if (savedState) {
    const parsedState = JSON.parse(savedState);
    playerOne.value = parsedState.playerOne || playerOne.value;
    playerTwo.value = parsedState.playerTwo || playerTwo.value;
    startGameOption.value =
      parsedState.startGameOption || startGameOption.value;
  }
  if (winState) {
    const parsedState = JSON.parse(winState);
    playerOneWins.value = parsedState.playerOneWins || playerOneWins.value;
    playerTwoWins.value = parsedState.playerTwoWins || playerTwoWins.value;
  }
  if (numState) {
    const parsedState = JSON.parse(numState);
    selectedOption.value = parsedState.selectedOption || selectedOption.value;
  }
});

const errors = reactive({
  playerOne: "",
  playerTwo: "",
  selectedOption: "",
});

function updateWins(payload: { playerOneWins: number; playerTwoWins: number }) {
  playerOneWins.value = payload.playerOneWins;
  playerTwoWins.value = payload.playerTwoWins;
}

function finishGame(payload: { startNew: boolean; restartGame: boolean }) {
  startNew.value = payload.startNew;
  restartGame.value = payload.restartGame;
}

function startNewGame() {
  errors.playerOne = "";
  errors.playerTwo = "";
  errors.selectedOption = "";

  let valid = true;
  if (!playerOne.value.trim()) {
    errors.playerOne = "Enter Player One Name";
    valid = false;
  }
  if (!playerTwo.value.trim()) {
    errors.playerTwo = "Enter Player Two Name";
    valid = false;
  }
  if (!selectedOption.value.trim()) {
    errors.selectedOption = "Select Number of Games";
    valid = false;
  }
  if (valid) {
    startGameOption.value = true;
  }
}

watch([playerOne, playerTwo, selectedOption], () => {
  const state = {
    selectedOption: selectedOption.value,
  };
  localStorage.setItem("ticTacToeNum", JSON.stringify(state));
  if (playerOne.value.trim()) {
    errors.playerOne = "";
  }
  if (playerTwo.value.trim()) {
    errors.playerTwo = "";
  }
  if (selectedOption.value.trim()) {
    errors.selectedOption = "";
  }
});

watch([playerOneWins, playerTwoWins], () => {
  const state = {
    playerOneWins: playerOneWins.value,
    playerTwoWins: playerTwoWins.value,
  };
  localStorage.setItem("ticTacToeWins", JSON.stringify(state));
  switch (selectedOption.value) {
    case "3":
      if (playerOneWins.value === 2 || playerTwoWins.value === 2) {
        gameWinner.value =
          playerOneWins.value === 2 ? playerOne.value : playerTwo.value;
        endGame.value = true;
        confetti({
          particleCount: 160,
          spread: 75,
          startVelocity: 45,
          origin: { y: 0.6 },
        });
      }
      break;
    case "5":
      if (playerOneWins.value === 3 || playerTwoWins.value === 3) {
        gameWinner.value =
          playerOneWins.value === 3 ? playerOne.value : playerTwo.value;
        endGame.value = true;
        confetti({
          particleCount: 160,
          spread: 75,
          startVelocity: 45,
          origin: { y: 0.6 },
        });
      }
      break;
    case "7":
      if (playerOneWins.value === 4 || playerTwoWins.value === 4) {
        gameWinner.value =
          playerOneWins.value === 4 ? playerOne.value : playerTwo.value;
        endGame.value = true;
        confetti({
          particleCount: 160,
          spread: 75,
          startVelocity: 45,
          origin: { y: 0.6 },
        });
      }
      break;
    default:
      break;
  }
});

watch(startNew, () => {
  if (startNew.value) {
    startGameOption.value = false;
    playerOne.value = "";
    playerTwo.value = "";
    selectedOption.value = "";
    endGame.value = false;
    playerOneWins.value = 0;
    playerTwoWins.value = 0;
    startNew.value = false;
    restartGame.value = false;
  }
});
watch(restartGame, () => {
  if (restartGame.value) {
    playerOneWins.value = 0;
    playerTwoWins.value = 0;
    endGame.value = false;
    // restartGame.value = false
  }
});

watch([playerOne, playerTwo, startGameOption], () => {
  const state = {
    playerOne: playerOne.value,
    playerTwo: playerTwo.value,
    startGameOption: startGameOption.value,
  };
  localStorage.setItem("ticTacToeState", JSON.stringify(state));
});
</script>

<template>
  <Header></Header>
  <div class="bg-rose-50 h-screen grid grid-cols-3">
    <div class="flex flex-col gap-3 p-8">
      <p class="font-serif">
        {{ !startGameOption ? "Enter Player Names:" : "Current Players:" }}
      </p>
      <form @submit.prevent="startNewGame" novalidate>
        <div class="flex flex-col gap-5" v-if="!startGameOption">
          <div class="flex flex-row gap-3">
            <div class="flex flex-col gap-2">
              <input
                type="text"
                v-model="playerOne"
                class="border p-2 rounded font-serif"
                required
              />
              <p v-if="errors.playerOne" class="text-red-500 text-sm mt-1">
                {{ errors.playerOne }}
              </p>
            </div>
            <div class="flex flex-col gap-2">
              <input
                type="text"
                v-model="playerTwo"
                class="border p-2 rounded font-serif"
                required
              />
              <p v-if="errors.playerTwo" class="text-red-500 text-sm mt-1">
                {{ errors.playerTwo }}
              </p>
            </div>
          </div>

          <div class="space-y-2 font-serif">
            <p class="pb-3">Select Number of Games</p>
            <label class="flex items-center space-x-2 gap-2">
              <input
                type="radio"
                value="3"
                v-model="selectedOption"
                class="text-blue-500 focus:ring-blue-500"
              />
              <span>3</span>
            </label>

            <label class="flex items-center space-x-2 gap-2">
              <input
                type="radio"
                value="5"
                v-model="selectedOption"
                class="text-blue-500 focus:ring-blue-500"
              />
              <span>5</span>
            </label>

            <label class="flex items-center space-x-2 gap-2">
              <input
                type="radio"
                value="7"
                v-model="selectedOption"
                class="text-blue-500 focus:ring-blue-500"
              />
              <span>7</span>
            </label>
            <p v-if="errors.selectedOption" class="text-red-500 text-sm mt-1">
              {{ errors.selectedOption }}
            </p>
          </div>
        </div>

        <div v-if="startGameOption">
          <p class="font-serif">{{ playerOne }}</p>
          <p class="font-serif">{{ playerTwo }}</p>
        </div>
        <div class="pt-5">
          <button
            class="bg-gray-500 text-white h-10 w-20 rounded-lg cursor-pointer font-serif hover:bg-gray-800"
            v-if="!startGameOption"
            type="submit"
          >
            Start
          </button>
        </div>
      </form>
    </div>
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        class="flex flex-col justify-center items-center gap-4"
        v-if="playerOne.length > 0 && playerTwo.length > 0 && startGameOption"
      >
        <div
          class="border-2 border-gray-500 bg-gray-500 text-xl rounded-md w-fit"
        >
          <p class="text-white p-6 font-serif">Tic Tac Toe</p>
        </div>
        <TicTacToeGame
          :startGameOption="startGameOption"
          :playerOne="playerOne"
          :playerTwo="playerTwo"
          @send-wins="updateWins"
          :endGame="endGame"
          :restartGame="restartGame"
          :startNew="startNew"
        /></div
    ></Transition>

    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        class="flex flex-col gap-3 p-8 h-screen items-center justify-center"
        v-if="playerOne.length > 0 && playerTwo.length > 0 && startGameOption"
      >
        <scoreBoard
          :playerOne="playerOne"
          :playerTwo="playerTwo"
          :playerOneWins="playerOneWins"
          :playerTwoWins="playerTwoWins"
          :selectedOption="selectedOption"
          :endGame="endGame"
          :gameWinner="gameWinner"
          @finish-game="finishGame"
        />
      </div>
    </Transition>
  </div>
</template>

<style scoped></style>
