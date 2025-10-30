import { useGameStore } from "~/store/gameStore"

export const useAuthorizeUser = () => {
    const gameStore = useGameStore();
    return gameStore.setLoginState;
}