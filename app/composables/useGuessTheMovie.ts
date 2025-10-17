// composables/useGuessTheMovie.ts
import { ref, watch, onMounted } from "vue"
import type { Movie } from "~/pages/guessthemovie.vue"
import { useShuffledName } from "#imports"

export function useGuessTheMovie(initialLevel = "Easy") {
  const currentLevel = ref(initialLevel)
  const currentQuestion = ref(0)
  const quizMovies = ref<Movie[]>([])
  const shuffled = ref<string[]>([])
  const addLetter = ref<string[]>([])
  const usedLetters = ref<number[]>([])
  const highlightAnswer = ref(false)
  const showRed = ref(false)

  // ✅ Fetch movies (respecting capitalization)
  const loadMovies = async (level: string) => {
    const { data } = await useFetch<Movie[]>("/gameData", { query: { level } })
    quizMovies.value = data.value ?? []
    currentQuestion.value = 0
    initQuestion()
  }

  // ✅ Reset question and shuffle letters
  const initQuestion = () => {
    const movie = quizMovies.value[currentQuestion.value]
    if (!movie) return

    const nameWithoutSpaces = movie.name.replace(/\s+/g, "")
    addLetter.value = Array(nameWithoutSpaces.length).fill("")
    usedLetters.value = []
    highlightAnswer.value = false
    showRed.value = false

    shuffled.value = useShuffledName(quizMovies.value, currentQuestion.value)
  }

  // ✅ Handle letter click
  const moveLetters = (letter: string, index: number) => {
    const movie = quizMovies.value[currentQuestion.value]
    const nameWithoutSpaces = movie?.name.replace(/\s+/g, "")
    const nextPos = addLetter.value.findIndex((l) => l === "")
    if (nextPos === -1) return

    addLetter.value[nextPos] = letter
    usedLetters.value.push(index)

    const currentGuess = addLetter.value.join("").toUpperCase()
    const target = nameWithoutSpaces?.toUpperCase()

    if (currentGuess.length === target?.length) {
      highlightAnswer.value = currentGuess === target
      showRed.value = !highlightAnswer.value
    }
  }

  // ✅ Move to next question
  const moveForward = () => {
    if (currentQuestion.value < quizMovies.value.length - 1) {
      currentQuestion.value++
      initQuestion()
    }
  }

  // ✅ Restart current question
  const restartLevel = () => initQuestion()

  // ✅ Move to next level (capitalization preserved)
  const moveToNextLevel = async () => {
    const next =
      currentLevel.value === "Easy"
        ? "Medium"
        : currentLevel.value === "Medium"
        ? "Hard"
        : "Easy"

    currentLevel.value = next
    await loadMovies(next.toLowerCase())
  }

  watch(currentQuestion, () => initQuestion())

  onMounted(() => loadMovies(currentLevel.value.toLowerCase()))

  return {
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
  }
}
