// src/app/(pages)/chats/page.tsx
import { Sidebar } from '@/widgets/sidebar'
import ScreenByType from '../ui/ScreenByType'
import { Suspense } from 'react' // 🚀 Импортируем нативный React Suspense
import { getSession } from '@/shared/lib/server-current-user'
import { redirect } from 'next/navigation'

async function AuthGuard() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/auth/sign-in?redirect=/chats");
  }
  
  return null
}
const Chats = () => {
  return (
    <>
      <Suspense fallback={null}>
        <AuthGuard />
      </Suspense>

      <aside className="w-full md:w-80 h-full shrink-0 hidden md:block">
        <Sidebar sidebarType={"chats"} />
      </aside>

      <main className="flex-1 h-full">
        <ScreenByType screenType={"chats"}/>
      </main>
    </>
  );
};

export default Chats;