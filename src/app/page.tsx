import { ChatWindow } from "@/widgets/chat-window";
import Link from "next/link";
import { getServerSession } from "./lib/get-session";
import { Sidebar } from "@/widgets/sidebar";

export default async function Home() {
   const session = await getServerSession();

  if (!session) {
    return (
      <div className="p-4 flex gap-4">
        <Link
          className="p-2 border border-amber-100 rounded-lg"
          href="/auth/sign-in"
        >
          Войти
        </Link>
        <Link
          className="p-2 border border-amber-100 rounded-lg"
          href="/auth/sign-up"
        >
          Регистрация
        </Link>
      </div>
    );
    // return <RedirectToSignIn />;
  }

  return (
     <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Боковая панель занимает 1/3 экрана на ПК */}
      <aside className="w-full md:w-80 h-full border-r border-border shrink-0 hidden md:block">
        <Sidebar />
      </aside>

      {/* Окно активного чата занимает всё оставшееся пространство */}
      <main className="flex-1 h-full">
        <ChatWindow />
      </main>
    </div>
  );
}