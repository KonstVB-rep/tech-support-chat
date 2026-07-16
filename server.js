import "dotenv/config";
import { createServer } from "http";
import { Server } from "socket.io";

import dotenv from "dotenv";
dotenv.config({ path: ".env.development" });

// 1. HTTP Сервер + Обработка триггеров от Next.js
const httpServer = createServer((req, res) => {
  // ✅ HTTP API для триггеров от Next.js
  if (req.method === "POST" && req.url === "/api/trigger") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const { event, payload } = JSON.parse(body);
        console.log(`🎯 [HTTP TRIGGER] Получен: ${event}`);

        // Проверяем секретный токен
        const token = req.headers["x-internal-token"];
        console.log(
          `🎯 [INTERNAL_TRIGGER_TOKEN] Получен: ${process.env.INTERNAL_TRIGGER_TOKEN}`,
        );
        if (token !== process.env.INTERNAL_TRIGGER_TOKEN) {
          res.writeHead(401, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Unauthorized" }));
          return;
        }

        // Эмитим событие всем клиентам через io
        switch (event) {
          case "srv:message:new":
            io.to(`chat:${payload.message.chatId}`).emit(
              "message:new",
              payload.message,
            );
            io.emit("chat:updated", { chatId: payload.message.chatId });
            if (payload.organizationId) {
              io.to(`org:${payload.organizationId}`).emit("chat:updated", {
                chatId: payload.message.chatId,
              });
            }
            const chatMembers = await prisma.chatMember.findMany({
              where: {
                chatId: payload.message.chatId,
              },
              select: {
                profileId: true,
              }
            })  

            for(const member of chatMembers){
              const isSupport  = await prisma.supportEngineer.findUnique({
                where: {
                  profileId: member.profileId
                }
              })

              if(isSupport){
                  import("../../src/shared/lib/web-push/send-push.ts").then(
                    ({ sendPushToProfile }) => {
                      sendPushToProfile(member.profileId, {
                        title: "Новое сообщение",
                        body: payload.message.text?.substring(0, 100) || "📎 Медиа",
                        url: `/chats/${payload.message.chatId}`,
                        tag: `msg-${payload.message.chatId}`,
                      });
                    },
                  );
              }
            }


            break;

          case "srv:chat:new":
            io.to(`org:${payload.organizationId}`).emit(
              "chat:new",
              payload.chat,
            );
            io.emit("chat:admin:new", payload.chat);
            break;

          case "srv:member:added":
            io.to(`user:${payload.targetProfileId}`).emit(
              "chat:new",
              payload.chat,
            );
            break;

          case "srv:member:removed":
            io.to(`user:${payload.targetProfileId}`).emit("chat:removed", {
              chatId: payload.chatId,
            });
            break;

          case "srv:chat:deleted":
            io.to(`org:${payload.organizationId}`).emit("chat:removed", {
              chatId: payload.chatId,
            });
            io.emit("chat:removed", { chatId: payload.chatId });
            break;

          case "srv:chat:rename":
            io.to(`org:${payload.organizationId}`).emit("chat:renamed", {
              chatId: payload.chatId,
              newTitle: payload.newTitle,
            });
            io.emit("chat:renamed", {
              chatId: payload.chatId,
              newTitle: payload.newTitle,
            });
            io.to(`chat:${payload.chatId}`).emit("chat:renamed", {
              chatId: payload.chatId,
              newTitle: payload.newTitle,
            });
            break;

          case "srv:user:updated": 
            if(payload.userId){
              io.to(`user:${payload.userId}`).emit("user:updated", payload.user);
            } 

            if(payload.organizationId){
              io.to(`org:${payload.organizationId}`).emit("user:updated", payload.user);
            }
            io.emit("user:updated", payload.user);
            console.log(`👤 [USER UPDATED] profile:${payload.profileId}`);
            break;
          default:
            console.warn(`⚠️ Неизвестное событие: ${event}`);
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true }));
      } catch (err) {
        console.error("❌ [HTTP TRIGGER] Ошибка:", err);
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Bad request" }));
      }
    });
    return;
  }

  // Health check
  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok" }));
    return;
  }

  res.writeHead(404);
  res.end();
});

// 2. Socket.IO для клиентов (Браузер)
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  const userId = socket.handshake.auth.userId;
  console.log(`✅ Подключен сокет: ${userId || "anonymous"} (${socket.id})`);

  socket.onAny((eventName, ...args) => {
    console.log(`🔍 [CLIENT EVENT] "${eventName}" от юзера: ${userId}`);
  });


  socket.on("user:init", ({ profileId, managedOrgIds }) => {
    if (!profileId || userId === "SYSTEM_NEXTJS") return;
    socket.join(`user:${profileId}`);
    console.log(`👤 Профиль [${profileId}] вошел в комнату user:${profileId}`);

    if (Array.isArray(managedOrgIds)) {
      managedOrgIds.forEach((orgId) => {
        socket.join(`org:${orgId}`);
        console.log(`🏭 Руководитель вошел в org:${orgId}`);
      });
    }
  });

  socket.on("chat:join", (chatId) => {
    socket.join(`chat:${chatId}`);
    console.log(`📌 ${userId} joined chat:${chatId}`);
  });

  socket.on("chat:leave", (chatId) => {
    socket.leave(`chat:${chatId}`);
    console.log(`📤 ${userId} left chat:${chatId}`);
  });

  socket.on("message:new", (message) => {
    console.log(`💬 Клиентское сообщение в chat:${message.chatId}`);
    socket.to(`chat:${message.chatId}`).emit("message:new", message);
    io.emit("chat:updated", { chatId: message.chatId });
  });

  socket.on("disconnect", () => {
    console.log(`❌ Отключен сокет: ${userId || "anonymous"} (${socket.id})`);
  });
});

// 3. Запуск
const PORT = process.env.SOCKET_PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`\n🚀 ========================================`);
  console.log(`🚀 Socket.IO + HTTP Trigger сервер запущен на порту ${PORT}`);
  console.log(`🚀 Health check: http://localhost:${PORT}/health`);
  console.log(`🚀 Trigger API:   POST http://localhost:${PORT}/api/trigger`);
  console.log(`🚀 ========================================\n`);
});
