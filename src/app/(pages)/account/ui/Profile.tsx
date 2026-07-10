// src/app/(pages)/account/Profile.tsx
import { getProfile } from "@/entities/profile/api/getProfile"; // Твой серверный геттер
import { getCurrentUser } from "@/shared/lib/server-current-user";

import { ProtectByRole } from "@/shared/lib/ProtectByRole";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { AvatarUser } from "@/entities/user";

const Profile = async () => {
  const user = await getCurrentUser();
  if (!user) return null;

  const profile = await getProfile(user.id);


  if (!profile) {
    return <div className="text-yellow-500 font-medium p-4">Профиль не найден в базе данных</div>;
  }

  const memberships = profile.organizationMembers || [];

  return (
    <Card className="w-full mx-auto sm:max-w-lg h-max bg-transparent border-none shadow-none ring-1">
      <CardHeader>
        <CardTitle className="flex items-center justify-start gap-2 text-center uppercase font-bold tracking-wider"><AvatarUser/>Профиль</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-5">

          <div className="space-y-1">
            <div className="text-sm font-medium text-muted-foreground">Имя</div>
            <div className="text-base font-medium text-foreground">{profile.name ?? "—"}</div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Организации и Должности</div>
            {memberships.length === 0 ? (
              <div className="text-base text-muted-foreground italic">Нет привязанных организаций</div>
            ) : (
              <div className="space-y-3 bg-muted/30 border border-border p-3 rounded-xl">
                {memberships.map((member: any) => (
                  <div key={member.id} className="flex items-start justify-between gap-4 border-b border-border/50 last:border-0 pb-2 last:pb-0">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-foreground">{member.organization?.name}</span>
                      <span className="text-xs text-muted-foreground mt-0.5">
                        Должность: <span className="text-foreground/80 font-medium">{member.position || "Не указана"}</span>
                      </span>
                    </div>
                    <Badge variant="secondary" className="text-[10px] font-semibold px-2 py-0.5 uppercase tracking-wider">
                      {member.role === "RESPONSIBLE" ? "Ответственный" : "Сотрудник"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Телефон */}
          <div className="space-y-1">
            <div className="text-sm font-medium text-muted-foreground">Телефон</div>
            <div className="text-base text-foreground">{profile.phone ?? "—"}</div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <div className="text-sm font-medium text-muted-foreground">Электронная почта</div>
            <div className="text-base text-foreground">{profile.email ?? user?.email ?? "—"}</div>
          </div>

          {/* Глобальная роль на портале */}
          <ProtectByRole> 
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">Глобальная роль</div>
              <div className="text-base text-foreground">
                 {user.role === "admin" ? "Администратор системы" : user.role}
              </div>
            </div>
          </ProtectByRole>
        </div>
      </CardContent>
    </Card>
  );
};

export default Profile;
