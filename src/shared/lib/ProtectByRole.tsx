"use client"

import { OrgRole } from "@prisma/client" // Наш чистый enum из Призмы
import { USER_ROLE } from "../constants"
import { useCurrentUser } from "./hooks/useCurrentUser"

interface ProtectProps {
  // Роль Better Auth: "admin" или "user". По умолчанию ADMIN
  requiredRole?: "admin" | "user"
  // Роль сотрудника на конкретном заводе (берём с бэкенда страницы)
  currentMemberRole?: OrgRole | null
  // Какая локальная роль из OrgRole требуется для отображения (по умолчанию RESPONSIBLE)
  requiredOrgRole?: OrgRole | OrgRole[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

export const ProtectByRole = ({
  requiredRole = USER_ROLE.ADMIN,
  currentMemberRole = null,
  requiredOrgRole = OrgRole.RESPONSIBLE,
  children,
  fallback = null,
}: ProtectProps) => {
  const { user, isLoading } = useCurrentUser()

  if (isLoading) return null
  if (!user) return fallback

  // 1. ЖЕЛЕЗНОЕ ПРАВИЛО: Глобальный админ портала ("admin") всегда видит всё без исключений
  if (user.role === USER_ROLE.ADMIN) {
    return <>{children}</>
  }

  // 2. Если запрашивается доступ строго для админа, а текущий юзер не админ — скрываем блок
  if (requiredRole === "admin" && user.role !== "admin") {
    return fallback
  }

  // 3. 🚀 ТВОЯ ЧИСТАЯ ЛОГИКА: Если передан контекст компании — просто сравниваем OrgRole типы!
  if (currentMemberRole) {
    const allowedOrgRoles = Array.isArray(requiredOrgRole) ? requiredOrgRole : [requiredOrgRole]
    const hasLocalAccess = allowedOrgRoles.includes(currentMemberRole)

    if (!hasLocalAccess) return fallback
    return <>{children}</>
  }

  return <>{children}</>
}
