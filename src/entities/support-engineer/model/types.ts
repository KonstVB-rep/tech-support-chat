import { Prisma } from "@prisma/client";

// 🎯 Генерируем точный тип инженера, включая связи, которые мы запрашиваем в Prisma
export type SupportEngineerWithProfile = Prisma.UserGetPayload<{
  include: {
    profile: {
      select: {
        phone: true;
      };
    };
  };
}>;
