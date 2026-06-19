// instrumentation.ts
import { Server as SocketServer } from "socket.io";
import { createServer } from "http";

console.log("🔍 [1] instrumentation.ts загружен!");

export async function register() {
  console.log("🔍 [2] register() вызван!");
  console.log("🔍 [3] NEXT_RUNTIME:", process.env.NEXT_RUNTIME);

  if (process.env.NEXT_RUNTIME === "nodejs") {
    console.log("✅ [4] Запускаем Socket.IO...");

    try {
      const { PrismaClient } = await import("@prisma/client");
      const prisma = new PrismaClient();

      const httpServer = createServer();

      const io = new SocketServer(httpServer, {
        cors: {
          origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
          credentials: true,
        },
      });

      io.use(async (socket, next) => {
        try {
          const userId = socket.handshake.auth.userId as string;
          if (!userId) return next(new Error("Не авторизован"));

          const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { profile: true },
          });

          if (!user?.profile) {
            return next(new Error("Пользователь не найден"));
          }

          socket.data.userId = user.id;
          socket.data.profileId = user.profile.id;
          socket.data.role = user.role;
          next();
        } catch (err) {
          next(new Error("Ошибка аутентификации"));
        }
      });

      io.on("connection", async (socket) => {
        const { userId, profileId, role } = socket.data;
        console.log(`✅ Подключен: ${userId} (${role})`);

        if (role === "support") {
          const allChats = await prisma.chat.findMany({ select: { id: true } });
          allChats.forEach((chat) => socket.join(`chat:${chat.id}`));
        } else {
          const memberships = await prisma.chatMember.findMany({
            where: { profileId },
            select: { chatId: true },
          });
          memberships.forEach((m) => socket.join(`chat:${m.chatId}`));
        }

        socket.on("chat:join", (chatId: string) =>
          socket.join(`chat:${chatId}`),
        );
        socket.on("chat:leave", (chatId: string) =>
          socket.leave(`chat:${chatId}`),
        );

        socket.on("disconnect", () => {
          console.log(`❌ Отключен: ${userId}`);
        });
      });

      (global as any).io = io;

      const PORT = process.env.SOCKET_PORT || 4000;
      httpServer.listen(PORT, () => {
        console.log(`\n🚀 ========================================`);
        console.log(`🚀 Socket.IO сервер запущен на порту ${PORT}`);
        console.log(`🚀 ========================================\n`);
      });

      console.log("✅ [5] Socket.IO сервер инициализирован");
    } catch (err) {
      console.error("❌ Ошибка при запуске Socket.IO:", err);
    }
  } else {
    console.log("❌ [4] Не nodejs runtime, Socket.IO не запущен");
  }
}
