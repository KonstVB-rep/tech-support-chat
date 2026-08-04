"use client"

import { useEffect } from "react"
import { ErrorFallback } from "@/shared/ui/custom/ErrorFallback"

const ErrorPage = ({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) => {
  useEffect(() => {
    console.error("Error Log:", error)
  }, [error])

  return <ErrorFallback contextName="Pages Layout" error={error} onRetry={unstable_retry} />
}

export default ErrorPage
