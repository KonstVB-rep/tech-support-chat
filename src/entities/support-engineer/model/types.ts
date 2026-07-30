import type { Prisma } from "@prisma/client"

export type SupportEngineerWithProfile = Prisma.SupportEngineerGetPayload<{
  include: {
    profile: {
      include: {
        user: {
          select: {
            id: true
            name: true
            email: true
            role: true
            isActive: true
            createdAt: true
          }
        }
      }
    }
  }
}>
