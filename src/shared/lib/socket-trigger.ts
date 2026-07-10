// socket-trigger.ts
const SOCKET_SERVER_URL =
  process.env.SOCKET_SERVER_URL || "http://localhost:4000";
const INTERNAL_TOKEN = process.env.INTERNAL_TRIGGER_TOKEN || "dev-secret-token";

export async function triggerSocketEvent(
  event: string,
  payload: Record<string, unknown>,
): Promise<void> {
  console.log(`📡 [trigger] HTTP POST → ${event}`);

  try {
    const res = await fetch(`${SOCKET_SERVER_URL}/api/trigger`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-token": INTERNAL_TOKEN,
      },
      body: JSON.stringify({ event, payload }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status}: ${text}`);
    }

    console.log(`✅ [trigger] Доставлено: ${event}`);
  } catch (error) {
    console.error(`❌ [trigger] Ошибка доставки ${event}:`, error);
    // Не бросаем ошибку, чтобы не ломать основной API-запрос пользователя
  }
}
