"use client";

import { SingleOrganizationWithCounts } from "@/entities/organization";
import { OrganizationViewCard } from "@/entities/organization/ui/OrganizationViewCard";
import { UpdateOrganizationForm } from "@/features/manage-organization";
import { ProtectByRole } from "@/shared/lib/ProtectByRole";
import { Button } from "@/shared/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";

export const OrganizationDetails = ({
  data,
}: {
  data: SingleOrganizationWithCounts;
}) => {
  const [edit, setEdit] = useState(false);
  return (
    <div>
      <ProtectByRole>
        <Button
          variant="outline"
          size="icon"
          title="Редактировать"
          onClick={() => setEdit((prev) => !prev)}
        >
          <Pencil />
        </Button>
      </ProtectByRole>
      {edit ? (
        <ProtectByRole>
          <UpdateOrganizationForm organization={data} />
        </ProtectByRole>
      ) : (
        <OrganizationViewCard data={data} className="w-full justify-center" />
      )}
    </div>
  );
};
