// server.js
import "dotenv/config";
import { Server } from "socket.io";
import { createServer } from "http";

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  const userId = socket.handshake.auth.userId;
  console.log(`✅ Подключен: ${userId || "anonymous"} (${socket.id})`);

  socket.on("chat:join", (chatId) => {
    socket.join(`chat:${chatId}`);
    console.log(`📌 ${userId} joined chat:${chatId}`);
  });

  socket.on("chat:leave", (chatId) => {
    socket.leave(`chat:${chatId}`);
    console.log(`📤 ${userId} left chat:${chatId}`);
  });

  // ✅ Ретрансляция нового сообщения
  socket.on("message:new", (message) => {
    console.log(
      `💬 Новое сообщение в чате ${message.chatId} от ${message.profile?.name}`,
    );
    console.log(`📤 Рассылаем всем в комнате chat:${message.chatId}`);

    // Рассылаем всем КРОМЕ отправителя
    socket.to(`chat:${message.chatId}`).emit("message:new", message);

    // Уведомляем всех об обновлении чата
    io.emit("chat:updated", { chatId: message.chatId });
  });

  socket.on("disconnect", () => {
    console.log(`❌ Отключен: ${userId || "anonymous"} (${socket.id})`);
  });
});

const PORT = process.env.SOCKET_PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`\n🚀 ========================================`);
  console.log(`🚀 Socket.IO сервер запущен на порту ${PORT}`);
  console.log(`🚀 ========================================\n`);
});
