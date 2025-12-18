<script setup lang="ts">
import { useGameStore } from "~/store/gameStore";
import { XMarkIcon } from "@heroicons/vue/16/solid";

const gameStore = useGameStore();
const message = ref("");
const currentUser = gameStore.userDetails;

onMounted(() => {
  gameStore.socketEvents();
  gameStore.listenForMessages();
});

const sendMessage = () => {
  if (gameStore.activeChatUser.name === '') return;
  gameStore.sendChatMessage(gameStore.activeChatUser.email, message.value);
  message.value = "";
};
</script>

<template>
  <div class="w-64"  v-if="gameStore.activeChatUser.name !== ''">
    <button class="bg-blue-500 text-white font-serif w-full h-10 flex justify-between items-center">
      <p class="pl-2">{{ gameStore.activeChatUser.name }}</p> <XMarkIcon class="size-6 text-white" @click="gameStore.closeUserChat()"/>
    </button>
    <div class="h-64 bg-gray-200 border-2 border-gray-500">
                <ul class="mt-2">
          <li
            v-for="(msg, i) in gameStore.messages[gameStore.activeChatUser.email] || []"
            :key="i"
          >
          <div class="flex gap-2 p-2">
        <img
          :src="msg.from === gameStore.userDetails.email ? currentUser.picture : gameStore.activeChatUser.picture"
          alt="Avatar"
          class="h-6 w-6 rounded-full object-cover"
        />

            {{ msg.message }}
          </div>

          </li>
        </ul>
    </div>
    <div
      class="h-12 bg-white border-2 border-gray-500 flex"
    >
      <input type="text" class="p-1" v-model="message"></input>
      <button class="h-full w-24 bg-blue-500 text-white font-serif" @click="sendMessage">Send</button>
    </div>
  </div>
</template>
