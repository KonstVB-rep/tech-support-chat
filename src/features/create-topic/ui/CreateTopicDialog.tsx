// src/features/create-topic/ui/CreateTopicDialog.tsx
"use client";
import { useState } from "react";

import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Plus } from "lucide-react"; // Красивая иконка плюса из пресета Nova
import { toast } from "sonner";
import { useCreateTopic } from "../api/useCreateTopic";


const CreateTopicDialog = () => {
  const [title, setTitle] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  
  // Подключаем нашу мутацию создания темы
  const { mutate: createTopic, isPending } = useCreateTopic();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createTopic(title.trim(), {
      onSuccess: () => {
        toast.success("Тема по объекту успешно создана!");
        setTitle("");
        setIsOpen(false); // Закрываем модальное окно
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          size="icon" 
          title="Создать чат"
          className="bg-blue-700"
        >
          <Plus  className="text-primary" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] rounded-2xl select-none">
        <DialogHeader>
          <DialogTitle>Новое обращение по объекту</DialogTitle>
          <DialogDescription>
            Укажите название объекта недвижимости или краткую суть технической проблемы. Все инженеры нашей поддержки увидят этот чат.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="flex flex-col gap-2">
            <Input
              id="topic-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Название объекта"
              disabled={isPending}
              autoComplete="off"
              required
              className="rounded-xl h-10 border-muted focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => setIsOpen(false)}
              disabled={isPending}
              className="rounded-xl"
            >
              Отмена
            </Button>
            <Button 
              type="submit" 
              disabled={!title.trim() || isPending}
              className="rounded-xl px-5"
            >
              {isPending ? "Создание..." : "Открыть тему"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};


export default CreateTopicDialog;