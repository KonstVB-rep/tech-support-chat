import { io, type Socket } from "socket.io-client"

// В деве подключаемся к локальному серверу, на проде — к твоему будущему VPS
const SOCKET_URL = process.env.NEXT_PUBLIC_URL || "http://localhost:3000"

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false, // Не подключаемся автоматически, пока пользователь не вошел в чат
  transports: ["websocket"], // Сразу используем чистые веб-сокеты
})
