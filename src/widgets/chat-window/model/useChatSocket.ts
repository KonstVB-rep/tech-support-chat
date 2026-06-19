// src/widgets/chat-window/api/useChatSocket.ts
"use client";

import { useCallback } from "react";
import { getSocket } from "@/shared/lib/socket";

export function useChatSocket(ticketId: string | null) {
  const sendTyping = useCallback(
    (isTyping: boolean) => {
      if (!ticketId) return;

      const socket = getSocket();
      if (!socket?.connected) return;

      if (isTyping) {
        socket.emit("typing:start", ticketId);
      } else {
        socket.emit("typing:stop", ticketId);
      }
    },
    [ticketId],
  );

  return { sendTyping };
}
