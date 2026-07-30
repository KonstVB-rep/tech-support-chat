import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { authClient } from "@/app/lib/auth-client"

export function useSignOut() {
  const router = useRouter()

  const handleSignOut = async (e: React.FormEvent) => {
    e.preventDefault()
    // Вызываем клиентский метод, чтобы мгновенно обнулить useSession() в хедере
    const { error } = await authClient.signOut()

    if (error) {
      toast.error(error.message)
      return
    }

    // Очищаем историю и уходим на вход
    router.replace("/auth/sign-in")
  }

  return { handleSignOut }
}
