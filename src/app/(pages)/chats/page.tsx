// // src/app/(pages)/chats/page.tsx
// import { Sidebar } from "@/widgets/sidebar";
// import ScreenByType from "../ui/ScreenByType";
// import { Suspense } from "react"; // 🚀 Импортируем нативный React Suspense
// import { getSession } from "@/shared/lib/server-current-user";
// import { redirect } from "next/navigation";

// async function AuthGuard() {
//   const session = await getSession();

//   if (!session?.user) {
//     redirect("/auth/sign-in?redirect=/chats");
//   }

//   return null;
// }
// const Chats = () => {
//   return (
//     <>
//       <Suspense fallback={null}>
//         <AuthGuard />
//       </Suspense>

//       <aside className="w-full md:w-80 h-full shrink-0 ">
//         <Sidebar sidebarType={"chats"} />
//       </aside>

//       <main className="flex-1 h-full hidden md:block">
//         <ScreenByType screenType={"chats"} />
//       </main>
//     </>
//   );
// };

// export default Chats;

// src/app/(pages)/chats/page.tsx
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
  await AuthGuard();

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
};

export default Chats;
