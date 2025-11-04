// ~/socket/socket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket() {
  // Return existing instance if already created
  if (socket) return socket;

  // Create a new one when explicitly called
  socket = io("http://localhost:5000", {
    transports: ["websocket"],
    autoConnect: false, // don't connect immediately
  });

  return socket;
}
