import { getProfile } from "@/entities/profile/api/getProfile";
import { getSession } from "@/shared/lib/server-current-user";

export const getMembershipsAction = async () => {
  try {
    const session = await getSession();

    if (!session?.user) {
      return { succes: false, data: [], error: "Не авторизован" };
    }

    const profileWIthOrganization = await getProfile(session.user.id);

    if (!profileWIthOrganization) {
      return { success: false, data: [], error: "Профиль не найден" };
    }

    return {
      success: true,
      data: profileWIthOrganization.organizationMembers,
      error: null,
    };
  } catch (e) {
    console.log(e);
    return { success: false, data: [], error: "Произошла ошибка сервера" };
  }
};
