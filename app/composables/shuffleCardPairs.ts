import { ref } from "vue";
import type { Movie } from "~/pages/guessthemovie.vue";

export function useShuffledArray(strings: string[]) {
  const shuffled = ref<{ value: string }[]>([]);

  // Fisher–Yates shuffle
  function shuffle<T>(array: T[]): T[] {
    let currentIndex = array.length,
      randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  }

  // build the shuffled array once
  shuffled.value = shuffle(
    strings.flatMap((s) => [{ value: s }, { value: s }])
  );

  return shuffled;
}

export const useGetAllImages = (images: Movie[]) => {
  const imageOne = images.find((i: Movie) => i.name === "photoOne")?.img;
  const imageTwo = images.filter((i: Movie) => i.name === "photoTwo")[0]?.img;
  const imageThree = images.filter((i: Movie) => i.name === "photoThree")[0]
    ?.img;
  const imageFour = images.find((i: Movie) => i.name === "photoFour")?.img;
  const imageFive = images.filter((i: Movie) => i.name === "photoFive")[0]?.img;
  const imageSix = images.filter((i: Movie) => i.name === "photoSix")[0]?.img;
  const imageSeven = images.find((i: Movie) => i.name === "photoSeven")?.img;
  const imageEight = images.filter((i: Movie) => i.name === "photoEight")[0]
    ?.img;
  const imageNine = images.filter((i: Movie) => i.name === "photoNine")[0]?.img;
  const imageTen = images.find((i: Movie) => i.name === "photoTen")?.img;
  const imageEleven = images.filter((i: Movie) => i.name === "photoEleven")[0]
    ?.img;
  const imageTwelve = images.filter((i: Movie) => i.name === "photoTwelve")[0]
    ?.img;

  return {
    imageOne,
    imageTwo,
    imageThree,
    imageFour,
    imageFive,
    imageSix,
    imageSeven,
    imageEight,
    imageNine,
    imageTen,
    imageEleven,
    imageTwelve,
  };
};

export const useMoveForward = (images: Ref<any[]>) => {
  const currentLevel = ref(1);
  const levelNumber = ref(6);
  const winCards = ref<boolean[]>(Array(levelNumber.value).fill(false));
  const shuffledCards = ref<any[]>([]);

  // 🧩 Function to reset wins
  const resetWins = () => winCards.value.fill(false);

  // 🚀 Moved moveForward() here
  const moveForward = () => {
    currentLevel.value++;
    resetWins();

    const {
      imageOne,
      imageTwo,
      imageThree,
      imageFour,
      imageFive,
      imageSix,
      imageSeven,
      imageEight,
      imageNine,
      imageTen,
      imageEleven,
      imageTwelve,
    } = useGetAllImages(images.value);

    const levelImages: Record<number, string[]> = {
      2: [imageOne, imageTwo, imageThree, imageFour, imageFive, imageSix],
      3: [
        imageOne,
        imageTwo,
        imageThree,
        imageFour,
        imageFive,
        imageSix,
        imageSeven,
        imageEight,
        imageNine,
        imageTen,
        imageEleven,
        imageTwelve,
      ],
    };

    // If next level exists in map
    const nextLevelImages = levelImages[currentLevel.value];

    if (nextLevelImages) {
      levelNumber.value = nextLevelImages.length * 2;
      shuffledCards.value = useShuffledArray(nextLevelImages).value;
    }
  };

  return {
    currentLevel,
    levelNumber,
    winCards,
    shuffledCards,
    moveForward,
  };
};
