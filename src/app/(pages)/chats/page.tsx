// src/app/(pages)/chats/page.tsx
import { Suspense } from "react"; // ✅ Добавляем импорт
import { Sidebar } from "@/widgets/sidebar";
import ScreenByType from "../ui/ScreenByType";
import { getSession } from "@/shared/lib/server-current-user";
import { redirect } from "next/navigation";
import {
  HydrationBoundary,
  dehydrate,
  QueryClient,
} from "@tanstack/react-query";
import {
  fetchChatsServer,
  fetchMessagesServer,
} from "@/entities/chat/api/fetchServer";

async function AuthGuard() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/auth/sign-in?redirect=/chats");
  }

  return null;
}

interface ChatsPageProps {
  searchParams: Promise<{ chat?: string }>;
}

const Chats = async ({ searchParams }: ChatsPageProps) => {
  return (
    <Suspense fallback={<ChatsSkeleton />}>
      <AuthGuard />
      <ChatsContent searchParams={searchParams} />
    </Suspense>
  );
};

async function ChatsContent({ searchParams }: ChatsPageProps) {
  const { chat: chatIdFromUrl } = await searchParams;
  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: ["chats"],
      queryFn: fetchChatsServer,
      staleTime: 60_000,
    });
  } catch {}

  if (chatIdFromUrl) {
    try {
      await queryClient.prefetchQuery({
        queryKey: ["messages", chatIdFromUrl],
        queryFn: () => fetchMessagesServer(chatIdFromUrl),
        staleTime: 60_000,
      });
    } catch {}
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <aside className="w-full md:w-80 h-full shrink-0">
        <Sidebar sidebarType={"chats"} />
      </aside>

      <main className="flex-1 h-full hidden md:block">
        <ScreenByType screenType={"chats"} />
      </main>
    </HydrationBoundary>
  );
}

function ChatsSkeleton() {
  return (
    <div className="flex w-full h-dvh animate-pulse">
      <div className="w-full md:w-80 shrink-0 border-r p-4 space-y-3 hidden md:block">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-12 rounded-lg bg-muted" />
        ))}
      </div>
      <div className="flex-1 p-4 space-y-3 hidden md:block">
        <div className="h-14 rounded-lg bg-muted" />
        <div className="h-full rounded-lg bg-muted" />
      </div>
    </div>
  );
}

export default Chats;
