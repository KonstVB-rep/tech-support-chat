import { getCurrentUser } from "@/shared/lib/server-current-user";
import { redirect } from "next/navigation";
import { getProfile } from "@/entities/profile/api/getProfile"; // Т
import AccountClientContent from "./AccountClientContent";

export const AccountClient = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/sign-in");

  const profile = await getProfile(user.id);

  if (!profile) {
    return (
      <div className="text-yellow-500 font-medium p-4">
        Профиль не найден в базе данных
      </div>
    );
  }

  return <AccountClientContent profile={profile} />;
};
