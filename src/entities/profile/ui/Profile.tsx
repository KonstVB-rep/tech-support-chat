// src/app/(pages)/account/Profile.tsx
import { getProfile } from "@/entities/profile/api/getProfile"
import { getCurrentUser } from "@/shared/lib/server-current-user"
import ProfileCard from "./ProfileCard"

const Profile = async ({ id }: { id?: string }) => {
  const user = await getCurrentUser()
  if (!user) return null

  const profile = await getProfile(id || user.id)

  if (!profile) {
    return <div className="p-4 font-medium text-yellow-500">Профиль не найден в базе данных</div>
  }

  return <ProfileCard profile={profile} user={user} />
}

export default Profile
