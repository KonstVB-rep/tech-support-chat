// src/shared/ui/custom/Loader.tsx
"use client"

import type { FC } from "react"

const Loader: FC = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <span className="loader"></span>
    </div>
  )
}

export default Loader
