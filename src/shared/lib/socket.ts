// src/shared/lib/socket.ts
"use client";

import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (typeof window === "undefined") {
    throw new Error("Socket can only be used on client side");
  }

  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000", {
      autoConnect: false,
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });
  }

  return socket;
};

export const connectSocket = (userId: string): Socket => {
  const s = getSocket();

  if (!s.connected) {
    s.auth = { userId };
    s.connect();
  }

  return s;
};
