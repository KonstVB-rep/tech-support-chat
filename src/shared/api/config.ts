// src/shared/api/config.ts

export const apiConfig = {
  post: (body: Record<string, unknown> | string) => ({
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  }),
}
