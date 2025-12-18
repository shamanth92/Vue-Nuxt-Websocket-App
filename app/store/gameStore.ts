import { defineStore } from "pinia";
import { jwtDecode } from "jwt-decode";
import { getSocket } from "~/socket/socket";
import { useToast } from "vue-toastification";

interface AUTHENTICATION {
  accessToken: string;
  idToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface USER {
  name: string;
  phone_number: string;
  email: string;
  picture: string;
}

type GameStoreState = {
  userLoggedIn: boolean;
  authentication: AUTHENTICATION;
  userDetails: USER;
  isConnected: boolean;
  activePlayers: boolean;
  onlineUsers: USER[];
  messages: any;
  activeChatUser: USER;
  unreadMessages: any;
};

export const useGameStore = defineStore("game", {
  state: (): GameStoreState => ({
    userLoggedIn: false,
    isConnected: false,
    authentication: {
      accessToken: "",
      idToken: "",
      refreshToken: "",
      expiresIn: 0,
    },
    userDetails: {
      name: "",
      phone_number: "",
      email: "",
      picture: "",
    },
    activePlayers: false,
    onlineUsers: [],
    messages: {} as Record<string, { from: string; message: string }[]>,
    unreadMessages: {},
    activeChatUser: {
      name: "",
      phone_number: "",
      email: "",
      picture: "",
    },
  }),
  getters: {
    setLoginState: (state) => state.userLoggedIn,
    setTokens: (state) => state.authentication,
    setUserDetails: (state) => state.userDetails,
    setActivePlayers: (state) => state.activePlayers,
  },
  actions: {
    loginUser(isLoggedIn: boolean) {
      this.userLoggedIn = isLoggedIn;
    },
    storeAccessToken(tokens: AUTHENTICATION) {
      this.authentication = tokens;
      const idToken = useCookie("cognito_id_token", {
        maxAge: tokens.expiresIn,
        secure: true,
        sameSite: "strict",
      });

      const accessToken = useCookie("cognito_access_token", {
        maxAge: tokens.expiresIn,
        secure: true,
        sameSite: "strict",
      });

      const refreshToken = useCookie("cognito_refresh_token", {
        maxAge: tokens.expiresIn,
        httpOnly: true, // Can't be accessed by JavaScript (XSS protection)
        secure: true,
        sameSite: "strict",
      });

      idToken.value = tokens.idToken;
      accessToken.value = tokens.accessToken;
      refreshToken.value = tokens.refreshToken;
    },
    storeUserDetails(idToken: string) {
      try {
        const decoded: USER = jwtDecode(idToken);
        console.log("decoded", decoded);

        this.userDetails = {
          email: decoded.email,
          name: decoded.name,
          phone_number: decoded.phone_number,
          picture: decoded.picture,
        };
      } catch (error) {
        console.error("Token validation failed:", error);
      }
    },
    showActivePlayers() {
      this.activePlayers = !this.activePlayers;
    },
    setOpenChatUser(user: USER) {
      this.activeChatUser = user;
    },
    closeUserChat() {
      this.activeChatUser = {
        name: "",
        phone_number: "",
        email: "",
        picture: "",
      };
    },
    async initAuth() {
      const idToken = useCookie("cognito_id_token");

      if (idToken.value) {
        this.userLoggedIn = true;
        const decoded: USER = jwtDecode(idToken.value);

        this.userDetails = {
          email: decoded.email,
          name: decoded.name,
          phone_number: decoded.phone_number,
          picture: decoded.picture,
        };
      }
    },
    socketEvents() {
      const socket = getSocket(); // lazy init

      socket.connect(); // ✅ manually connect now

      socket.on("connect", () => {
        this.isConnected = true;
        socket.emit("user-online", this.userDetails);
        console.log("🟢 Connected to socket server:", socket.id);
      });

      socket.on("online-users", (users) => {
        console.log("👥 Online users:", users);
        this.onlineUsers = users;
      });

      socket.on("disconnect", () => {
        this.isConnected = false;
        console.log("🔴 Disconnected from socket server");
      });
    },
    sendChatMessage(toEmail: string, message: string) {
      const socket = getSocket();
      const from = this.userDetails.email;

      socket.emit("chat-message", { to: toEmail, from, message });

      // ✅ make sure Vue tracks new key
      if (!this.messages[toEmail]) {
        this.messages = { ...this.messages, [toEmail]: [] };
      }

      this.messages[toEmail].push({ from, message });
    },
    listenForMessages() {
      const socket = getSocket();
      const toast = useToast();

      socket.off("chat-message"); // avoid duplicate listeners
      socket.on("chat-message", ({ from, message }) => {
        console.log(`💬 Message from ${from}: ${message}`);
        // ✅ reactive key creation
        if (!this.messages[from]) {
          this.messages = { ...this.messages, [from]: [] };
        }

        this.messages[from].push({ from, message });
        this.unreadMessages = { ...this.unreadMessages, [from]: true };
        toast.success(`New message from ${from}`);
      });
    },
    startMultiplayerGame(user: USER) {
      const socket = getSocket();
      socket.emit("join-multiplayer-queue", user);

      socket.on("waiting-for-opponent", () => {
        console.log("⏳ Waiting for an opponent...");
      });

      socket.on("match-found", ({ roomId, players }) => {
        console.log("✅ Match found! Room:", roomId);
        console.log("Players:", players);
      });
    },
    disconnectSocket() {
      const socket = getSocket();
      if (socket.connected) {
        socket.disconnect();
        this.isConnected = false;
        console.log("Socket disconnected manually");
      }
    },
  },
});
