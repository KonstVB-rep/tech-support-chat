"use client"

import { useState } from "react"
import { Pencil } from "lucide-react"
import type { SingleOrganizationWithCounts } from "@/entities/organization"
import { OrganizationViewCard } from "@/entities/organization/ui/OrganizationViewCard"
import { UpdateOrganizationForm } from "@/features/manage-organization"
import { ProtectByRole } from "@/shared/lib/ProtectByRole"
import { Button } from "@/shared/ui/components/button"

export const OrganizationDetails = ({ data }: { data: SingleOrganizationWithCounts }) => {
  const [edit, setEdit] = useState(false)
  return (
    <div>
      <ProtectByRole>
        <Button
          onClick={() => setEdit((prev) => !prev)}
          size="icon"
          title="Редактировать"
          variant="outline"
        >
          <Pencil />
        </Button>
      </ProtectByRole>
      {edit ? (
        <ProtectByRole>
          <UpdateOrganizationForm organization={data} />
        </ProtectByRole>
      ) : (
        <OrganizationViewCard className="w-full justify-center" data={data} />
      )}
    </div>
  )
}
