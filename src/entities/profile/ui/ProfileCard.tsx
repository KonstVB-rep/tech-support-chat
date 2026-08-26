import { OrgRole } from "@prisma/client"
import Link from "next/link"
import { AvatarUser } from "@/entities/user"
import { ProtectByRole } from "@/shared/lib/ProtectByRole"
import type { getCurrentUser } from "@/shared/lib/server-current-user"
import { Badge } from "@/shared/ui/components/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/components/card"
import type { getProfile } from "../api"

export type ProfileData = NonNullable<Awaited<ReturnType<typeof getProfile>>>
type UserType = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>

const ProfileCard = ({ profile, user }: { profile: ProfileData; user: UserType }) => {
  const memberships = profile.organizationMembers || []
  return (
    <Card className="mx-auto h-max w-full border-none bg-card p-4 shadow-none ring-1 sm:max-w-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-start gap-2 text-center font-bold uppercase tracking-wider">
          <AvatarUser />
          Профиль
        </CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="font-medium text-muted-foreground text-sm">Имя</div>
            <div className="font-medium text-base text-foreground">{profile.name ?? "—"}</div>
          </div>

          <div className="space-y-2">
            <div className="font-medium text-muted-foreground text-sm">Организации и Должности</div>
            {memberships.length === 0 ? (
              <div className="text-base text-muted-foreground italic">
                Нет привязанных организаций
              </div>
            ) : (
              <div className="space-y-3 rounded-xl border border-border bg-muted/30 p-3">
                {memberships.map((member) => (
                  <div
                    className="flex items-start justify-between gap-4 border-border/50 border-b pb-2 last:border-0 last:pb-0"
                    key={member.id}
                  >
                    <div className="flex flex-col">
                      {member.role === OrgRole.RESPONSIBLE ? (
                        <Link
                          className="font-medium text-foreground text-sm hover:underline"
                          href={`/organization/${member.organization.id}`}
                        >
                          {member.organization.name}
                        </Link>
                      ) : (
                        <span className="font-medium text-foreground text-sm">
                          {member.organization.name}
                        </span>
                      )}
                      <span className="mt-0.5 text-muted-foreground text-xs">
                        Должность:{" "}
                        <span className="font-medium text-foreground/80">
                          {member.position || "Не указана"}
                        </span>
                      </span>
                    </div>
                    <Badge
                      className="px-2 py-0.5 font-semibold text-[10px] uppercase tracking-wider"
                      variant="secondary"
                    >
                      {member.role === "RESPONSIBLE" ? "Ответственный" : "Сотрудник"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Телефон */}
          <div className="space-y-1">
            <div className="font-medium text-muted-foreground text-sm">Телефон</div>
            <div className="text-base text-foreground">{profile.phone ?? "—"}</div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <div className="font-medium text-muted-foreground text-sm">Электронная почта</div>
            <div className="text-base text-foreground">{profile.email ?? user?.email ?? "—"}</div>
          </div>

          {/* Глобальная роль на портале */}
          <ProtectByRole>
            <div className="space-y-1">
              <div className="font-medium text-muted-foreground text-sm">Глобальная роль</div>
              <div className="text-base text-foreground">
                {user.role === "admin" ? "Администратор системы" : user.role}
              </div>
            </div>
          </ProtectByRole>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProfileCard
