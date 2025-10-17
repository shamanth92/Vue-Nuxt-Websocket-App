import type { BoxState } from '@/components/TicTacToeGame.vue'
import type { Ref } from 'vue'

export function useGameLogic(state: Ref<BoxState>) {
  const scenarioOne =
    Object.values(state.value)[0] === Object.values(state.value)[1] &&
    Object.values(state.value)[1] === Object.values(state.value)[2]

  const scenarioTwo =
    Object.values(state.value)[3] === Object.values(state.value)[4] &&
    Object.values(state.value)[4] === Object.values(state.value)[5]

  const scenarioThree =
    Object.values(state.value)[6] === Object.values(state.value)[7] &&
    Object.values(state.value)[7] === Object.values(state.value)[8]

  const scenarioFour =
    Object.values(state.value)[0] === Object.values(state.value)[3] &&
    Object.values(state.value)[3] === Object.values(state.value)[6]

  const scenarioFive =
    Object.values(state.value)[1] === Object.values(state.value)[4] &&
    Object.values(state.value)[4] === Object.values(state.value)[7]

  const scenarioSix =
    Object.values(state.value)[2] === Object.values(state.value)[5] &&
    Object.values(state.value)[5] === Object.values(state.value)[8]

  const scenarioSeven =
    Object.values(state.value)[0] === Object.values(state.value)[4] &&
    Object.values(state.value)[4] === Object.values(state.value)[8]

  const scenrioEight =
    Object.values(state.value)[2] === Object.values(state.value)[4] &&
    Object.values(state.value)[4] === Object.values(state.value)[6]

    return { scenarioOne, scenarioTwo, scenarioThree, scenarioFour, scenarioFive, scenarioSix, scenarioSeven, scenrioEight }
}
