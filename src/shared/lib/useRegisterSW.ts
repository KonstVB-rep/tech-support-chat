// src/shared/lib/useRegisterSW.ts
"use client"

import { useEffect } from "react"

export const useRegisterSW = () => {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("✅ SW зарегистрирован:", reg.scope))
        .catch((err) => console.error("❌ Ошибка регистрации SW:", err))
    }
  }, [])
}
