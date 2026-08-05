// src/app/(pages)/chats/page.tsx

import { Suspense } from "react"
import { dehydrate, HydrationBoundary, type InfiniteData, QueryClient } from "@tanstack/react-query"
import { redirect } from "next/navigation"
import { fetchChatsServer, fetchMessagesServerInfinite } from "@/entities/chat/api/fetchServer"
import type { MessagesResponse } from "@/entities/chat/api/types"
import { getSession } from "@/shared/lib/server-current-user"
import { Sidebar } from "@/widgets/sidebar"
import ScreenByType from "../ui/ScreenByType"

async function AuthGuard() {
  const session = await getSession()

  if (!session?.user) {
    redirect("/auth/sign-in?redirect=/chats")
  }

  return null
}

interface ChatsPageProps {
  searchParams: Promise<{ chat?: string }>
}

const Chats = ({ searchParams }: ChatsPageProps) => {
  return (
    <Suspense fallback={<ChatsSkeleton />}>
      <AuthGuard />
      <ChatsContent searchParams={searchParams} />
    </Suspense>
  )
}

const ChatsContent = async ({ searchParams }: ChatsPageProps) => {
  const { chat: chatIdFromUrl } = await searchParams
  const queryClient = new QueryClient()

  try {
    await queryClient.prefetchQuery({
      queryKey: ["chats"],
      queryFn: fetchChatsServer,
      staleTime: 60_000,
    })
  } catch {}

  if (chatIdFromUrl) {
    try {
      await queryClient.prefetchInfiniteQuery<
        MessagesResponse,
        Error,
        InfiniteData<MessagesResponse, string | null>,
        [string, string],
        string | null
      >({
        queryKey: ["messages", chatIdFromUrl],
        queryFn: async ({ pageParam }) => {
          return await fetchMessagesServerInfinite(chatIdFromUrl, pageParam)
        },
        initialPageParam: null,
        getNextPageParam: (lastPage: MessagesResponse) => lastPage.nextCursor ?? undefined,
        staleTime: 60_000,
      })
    } catch {}
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <aside className="h-full w-full shrink-0 md:w-80">
        <Sidebar sidebarType={"chats"} />
      </aside>

      <main className="hidden h-full flex-1 md:block">
        <ScreenByType screenType={"chats"} />
      </main>
    </HydrationBoundary>
  )
}

function ChatsSkeleton() {
  return (
    <div className="flex h-dvh w-full animate-pulse">
      <div className="hidden w-full shrink-0 space-y-3 border-r p-4 md:block md:w-80">
        {[1, 2, 3, 4, 5].map((i) => (
          <div className="h-12 rounded-lg bg-muted" key={i} />
        ))}
      </div>
      <div className="hidden flex-1 space-y-3 p-4 md:block">
        <div className="h-14 rounded-lg bg-muted" />
        <div className="h-full rounded-lg bg-muted" />
      </div>
    </div>
  )
}

export default Chats
