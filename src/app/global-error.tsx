// app/global-error.tsx
"use client";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="ru">
      <body>
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <h2>Критическая ошибка</h2>
          <p>Команда уже уведомлена</p>
          <button onClick={() => unstable_retry()}>Попробовать снова</button>
        </div>
      </body>
    </html>
  );
}
