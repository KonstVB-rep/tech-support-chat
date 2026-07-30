"use client"

import { useEffect } from "react"
import { type UseQueryOptions, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"

export const useQueryWithToast = <TData, TError extends Error>(
  options: UseQueryOptions<TData, TError>,
) => {
  const query = useQuery(options)

  useEffect(() => {
    if (query.isError && query.error) {
      toast.error(query.error.message)
    }
  }, [query.isError, query.error])

  return query
}
