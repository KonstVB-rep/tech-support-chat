import { Prisma } from "@prisma/client";

export type EmployeeWithProfile = Prisma.OrganizationMemberGetPayload<{
  include: {
    profile: {
      include: {
        user: {
          select: {
            email: true;
            role: true;
            isActive: true;
          };
        };
      };
    };
  };
}>;
