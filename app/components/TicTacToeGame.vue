<script setup lang="ts">
import { useGameLogic } from "@/composables/tictactoeLogic";
import { onMounted, ref, watch } from "vue";

const props = defineProps([
  "startGameOption",
  "playerOne",
  "playerTwo",
  "endGame",
  "restartGame",
  "startNew",
]);

const emit = defineEmits<{
  (
    e: "send-wins",
    payload: { playerOneWins: number; playerTwoWins: number }
  ): void;
}>();

export type BoxState = {
  [key: number]: string;
};

const status = Array(9).fill(false);
const boxState = ref<BoxState>({
  1: "",
  2: "",
  3: "",
  4: "",
  5: "",
  6: "",
  7: "",
  8: "",
  9: "",
});
const numClicks = ref(0);
const winner = ref("");
const winnerIndices = ref<number[]>([]);
const visible = ref(false);
const endGameNow = ref(false);
const drawn = ref(false);
const winsOne = ref(0);
const winsTwo = ref(0);

onMounted(() => {
  const savedState = localStorage.getItem("ticTacToeWinsChild");
  if (savedState) {
    const parsedState = JSON.parse(savedState);
    winsOne.value = parsedState.winsOne || winsOne.value;
    winsTwo.value = parsedState.winsTwo || winsTwo.value;
  }
});

watch(visible, (newVal, oldVal) => {
  console.log(`count changed from ${oldVal} to ${newVal}`, visible);
  if (visible.value) {
    const timer = setTimeout(() => {
      visible.value = false;
    }, 5000);

    return () => clearTimeout(timer); // cleanup
  }
});

watch(
  () => props.restartGame, // getter function
  () => {
    console.log("props.restartGame: ", props.restartGame);
    if (props.restartGame) {
      boxState.value = {
        1: "",
        2: "",
        3: "",
        4: "",
        5: "",
        6: "",
        7: "",
        8: "",
        9: "",
      };
      endGameNow.value = false;
      winner.value = "";
      numClicks.value = 0;
      winnerIndices.value = [];
      visible.value = false;
      drawn.value = false;
      winsOne.value = 0;
      winsTwo.value = 0;
    }
  }
);

watch(
  () => props.startNew, // getter function
  () => {
    if (props.restartGame) {
      boxState.value = {
        1: "",
        2: "",
        3: "",
        4: "",
        5: "",
        6: "",
        7: "",
        8: "",
        9: "",
      };
      endGameNow.value = false;
      winner.value = "";
      numClicks.value = 0;
      winnerIndices.value = [];
      visible.value = false;
      drawn.value = false;
      winsOne.value = 0;
      winsTwo.value = 0;
    }
  }
);

watch([winsOne, winsTwo], () => {
  const state = {
    winsOne: winsOne.value,
    winsTwo: winsTwo.value,
  };
  localStorage.setItem("ticTacToeWinsChild", JSON.stringify(state));
});

function boxClicked(index: number) {
  numClicks.value = numClicks.value + 1;
  boxState.value[index + 1] = numClicks.value % 2 !== 0 ? "X" : "O";
  const {
    scenarioOne,
    scenarioTwo,
    scenarioThree,
    scenarioFour,
    scenarioFive,
    scenarioSix,
    scenarioSeven,
    scenrioEight,
  } = useGameLogic(boxState);

  if (
    numClicks.value > 4 &&
    ((Object.values(boxState.value)[0] && scenarioOne) ||
      (Object.values(boxState.value)[3] && scenarioTwo) ||
      (Object.values(boxState.value)[6] && scenarioThree) ||
      (Object.values(boxState.value)[0] && scenarioFour) ||
      (Object.values(boxState.value)[1] && scenarioFive) ||
      (Object.values(boxState.value)[2] && scenarioSix) ||
      (Object.values(boxState.value)[0] && scenarioSeven) ||
      (Object.values(boxState.value)[2] && scenrioEight))
  ) {
    if (numClicks.value % 2 === 0) {
      winner.value = props.playerTwo;
      winsTwo.value = winsTwo.value + 1;
      emit("send-wins", {
        playerOneWins: winsOne.value,
        playerTwoWins: winsTwo.value,
      });
    } else {
      winner.value = props.playerOne;
      winsOne.value = winsOne.value + 1;
      emit("send-wins", {
        playerOneWins: winsOne.value,
        playerTwoWins: winsTwo.value,
      });
    }
    if (scenarioOne) {
      winnerIndices.value = [0, 1, 2];
    } else if (scenarioTwo) {
      winnerIndices.value = [3, 4, 5];
    } else if (scenarioThree) {
      winnerIndices.value = [6, 7, 8];
    } else if (scenarioFour) {
      winnerIndices.value = [0, 3, 6];
    } else if (scenarioFive) {
      winnerIndices.value = [1, 4, 7];
    } else if (scenarioSix) {
      winnerIndices.value = [2, 5, 8];
    } else if (scenarioSeven) {
      winnerIndices.value = [0, 4, 8];
    } else if (scenrioEight) {
      winnerIndices.value = [2, 4, 6];
    }
    visible.value = true;
    endGameNow.value = true;
  } else {
    if (
      Object.values(boxState.value).every((val) => val === "X" || val === "O")
    ) {
      drawn.value = true;
      visible.value = true;
    }
  }
}

function resetGame() {
  boxState.value = {
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
    7: "",
    8: "",
    9: "",
  };
  endGameNow.value = false;
  winner.value = "";
  numClicks.value = 0;
  winnerIndices.value = [];
  visible.value = false;
  drawn.value = false;
}
</script>

<template>
  <div class="grid grid-cols-3">
    <div v-for="(item, n) in status" :key="n" class="p-3">
      <button
        :class="[
          'h-32 w-32 rounded-lg cursor-pointer text-4xl text-white font-serif',
          winnerIndices.includes(n)
            ? 'bg-green-500'
            : Object.values(boxState)[n]
            ? 'bg-orange-500'
            : 'bg-gray-500',
        ]"
        @click="boxClicked(n)"
        :disabled="!startGameOption || endGameNow || drawn"
        id="tic-tac-toe"
      >
        {{ Object.values(boxState)[n] }}
      </button>
    </div>
  </div>
  <div class="flex flex-row gap-3" v-if="startGameOption">
    <button class="bg-gray-500 h-10 w-32 rounded-lg text-white font-serif">
      {{ playerOne }}: X
    </button>
    <button class="bg-gray-500 h-10 w-32 rounded-lg text-white font-serif">
      {{ playerTwo }}: O
    </button>
  </div>
  <div class="flex justify-center items-center" v-if="!endGame">
    <button
      class="bg-gray-500 text-white h-10 w-20 rounded-lg cursor-pointer font-serif hover:bg-gray-800"
      @click="resetGame"
    >
      Reset
    </button>
  </div>

  <div
    v-if="visible"
    class="fixed top-4 left-1/2 -translate-x-1/2 opacity-100 scale-100 transition-all duration-300 ease-out transform z-50"
  >
    <div class="flex flex-row w-75 bg-green-500 p-3 rounded-md">
      <div>
        <p className="text-white font-serif">
          {{ !drawn ? `${winner} wins!` : "Match Drawn" }}
        </p>
      </div>
      <div></div>
    </div>
  </div>
</template>
