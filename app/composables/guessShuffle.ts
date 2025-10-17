export function useShuffledName(quizMovies, currentQuestion) {
  const movie = quizMovies[currentQuestion];
  if (!movie?.name) return;

  const shuffledName = movie.name
    .split("")
    .filter((ch): ch is string => ch.trim() !== "");

  for (let i = shuffledName.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledName[i], shuffledName[j]] = [shuffledName[j], shuffledName[i]];
  }

  return shuffledName.join("");
}