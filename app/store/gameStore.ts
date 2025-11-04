import { defineStore } from "pinia";
import { jwtDecode } from "jwt-decode";
import { getSocket } from "~/socket/socket";

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
  }),
  getters: {
    setLoginState: (state) => state.userLoggedIn,
    setTokens: (state) => state.authentication,
    setUserDetails: (state) => state.userDetails,
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
        console.log("🟢 Connected to socket server:", socket.id);
      });

      socket.on("disconnect", () => {
        this.isConnected = false;
        console.log("🔴 Disconnected from socket server");
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
