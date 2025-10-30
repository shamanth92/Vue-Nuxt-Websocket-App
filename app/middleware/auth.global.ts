import { useGameStore } from "~/store/gameStore";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useGameStore();
  await authStore.initAuth();
  if (to.path === "/") {
    return;
  }
  if (!useAuthorizeUser()) {
    return navigateTo("/");
  }
});
