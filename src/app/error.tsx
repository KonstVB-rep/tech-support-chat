// app/dashboard/error.tsx
"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <h2 className="text-lg font-semibold">Что-то пошло не так</h2>
      <button onClick={() => unstable_retry()}>Попробовать снова</button>
    </div>
  );
}
