"use client";

import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Plus } from "lucide-react";
import { AddSupportEngineerForm } from "./AddSupportEngineerForm";

export const AddSupportEngineerDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" title="Добавить инженера">
          <Plus />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Добавить инженера техподдержки</DialogTitle>
          <DialogDescription>
            Создайте аккаунт нового инженера поддержки
          </DialogDescription>
        </DialogHeader>

        <AddSupportEngineerForm />
      </DialogContent>
    </Dialog>
  );
};
