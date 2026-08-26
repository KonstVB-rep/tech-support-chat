// src/entities/organization/model/types.ts
import type { Prisma } from "@prisma/client"

// 🎯 Автоматически генерируем точный тип организации со всеми _count полями из Prisma-запроса
export type OrganizationWithCounts = Prisma.OrganizationGetPayload<{
  include: {
    _count: {
      select: {
        members: true
        chats: true
      }
    }
  }
}>

export type SingleOrganizationWithCounts = Prisma.OrganizationGetPayload<{
  include: {
    _count: { select: { members: true; chats: true } }
  }
}>
