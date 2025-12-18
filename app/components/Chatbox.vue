<script setup lang="ts">
import { ref } from "vue";
import { useGameStore } from "~/store/gameStore";
import { ChatBubbleBottomCenterIcon } from "@heroicons/vue/16/solid";

const gameStore = useGameStore();
const isOpen = ref(false);
const currentUser = gameStore.userDetails;

const toggleChatbox = () => {
  isOpen.value = !isOpen.value;
};

const openUserChat = (user: any) => {
  gameStore.setOpenChatUser(user);
  gameStore.unreadMessages[user.email] = false;
};
</script>

<template>
  <div class="relative w-64">
    <!-- Chatbox body (slides up) -->
    <transition name="slide-up">
      <div
        v-if="isOpen"
        class="absolute bottom-14 right-0 w-64 bg-white border border-gray-300 rounded-t-lg shadow-xl overflow-hidden"
      >
        <div class="bg-blue-500 text-white text-center font-serif py-2">
          Online Users
        </div>

        <div class="max-h-64 overflow-y-auto">
          <p
            v-if="!gameStore.onlineUsers.length"
            class="text-center text-gray-500 py-4"
          >
            No users online
          </p>
          <ul v-else>
            <template v-for="user in gameStore.onlineUsers" :key="user.email">
              <li
                v-if="user.name !== currentUser.name"
                class="px-4 py-2 hover:bg-blue-50 flex items-center gap-2 border-b last:border-none cursor-pointer"
                @click="openUserChat(user)"
              >
                <span class="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                {{ user.name }}
                <!-- <span
                  v-if="gameStore.unreadMessages[user.email]"
                  class="h-3 w-3 bg-green-500 rounded-full"
                ></span> -->
                <ChatBubbleBottomCenterIcon
                  class="size-4 text-red-500"
                  v-if="gameStore.unreadMessages[user.email]"
                />
              </li>
            </template>
          </ul>
        </div>
      </div>
    </transition>

    <!-- Floating chatbox button -->
    <button
      @click="toggleChatbox"
      class="bg-blue-500 w-full flex justify-between items-center rounded-lg shadow-lg text-white font-serif px-4 py-3"
    >
      <span>Chatbox</span>
      <div
        class="w-3 h-3 rounded-full"
        :class="gameStore.onlineUsers.length ? 'bg-green-400' : 'bg-gray-400'"
      ></div>
    </button>
  </div>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
