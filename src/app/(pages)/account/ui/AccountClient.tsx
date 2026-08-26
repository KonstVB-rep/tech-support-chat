import { redirect } from "next/navigation"
import { getProfile } from "@/entities/profile/api/getProfile"
import { getCurrentUser } from "@/shared/lib/server-current-user"
import { AccountClientContent } from "@/widgets/account-setting-card"

export const AccountClient = async () => {
  const user = await getCurrentUser()
  if (!user) redirect("/auth/sign-in")

  const profile = await getProfile(user.id)

  if (!profile) {
    return <div className="p-4 font-medium text-yellow-500">Профиль не найден в базе данных</div>
  }

  return <AccountClientContent profile={profile} />
}
