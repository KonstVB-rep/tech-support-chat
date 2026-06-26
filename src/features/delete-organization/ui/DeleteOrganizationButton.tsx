"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { DeleteOrganizationDialog } from "./DeleteOrganizationDialog";


interface Props {
  ids: string | string[];
  organizationName?: string;  // для красивого сообщения
}

export const DeleteOrganizationButton = ({ ids, organizationName }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => setOpen(true)}
      >
        Удалить
      </Button>
      
      <DeleteOrganizationDialog
        ids={ids}
        organizationName={organizationName}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
};