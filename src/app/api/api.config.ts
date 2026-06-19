export const apiConfig = {
  // Функция принимает данные и сразу возвращает готовый объект настроек для fetch
  post: (body: string | object) => ({
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // Сериализуем данные напрямую, без лишней вложенности
    body: typeof body === "string" ? body : JSON.stringify(body),
  }),
};
