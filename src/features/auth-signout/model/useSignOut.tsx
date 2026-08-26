import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { authClient } from "@/app/lib/auth-client"
import { resetAllStores } from "@/shared/lib/zustand"

export function useSignOut() {
  const router = useRouter()

  const handleSignOut = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    resetAllStores()

    const { error } = await authClient.signOut()

    if (error) {
      toast.error(error.message)
      return
    }

    router.replace("/auth/sign-in")
  }

  return { handleSignOut }
}
