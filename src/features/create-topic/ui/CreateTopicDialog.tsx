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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/popover";

import { Plus, Check, Building2, Loader } from "lucide-react"; 
import { toast } from "sonner";
import { cn } from "@/shared/lib/utils";
import { useCreateTopic } from "../api/useCreateTopic";
import { useGetOrganizationsList } from "../api/useGetOrganizationsList";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/shared/ui/command";

const CreateTopicDialog = () => {
  const [title, setTitle] = useState("");
  const [selectedOrgId, setSelectedOrgId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  
  // Дополнительный стейт для открытия выпадающего списка поиска
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const { mutate: createTopic, isPending } = useCreateTopic();

  const { data: organizations = [], isLoading: isLoadingOrgs } =
    useGetOrganizationsList(isOpen);

  // Находим имя выбранной организации, чтобы отобразить его на кнопке триггера
  const selectedOrgName = organizations.find((org) => org.id === selectedOrgId)?.name;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle || !selectedOrgId || isPending) {
      toast.error("Заполните все поля: название, организация");
      return
    };

    createTopic(
      {
        title: trimmedTitle,
        organizationId: selectedOrgId,
      },
      {
        onSuccess: () => {
          toast.success("Тема по объекту успешно создана!");
          setTitle("");
          setSelectedOrgId(""); // Сбрасываем выбранную компанию
          setIsOpen(false);
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          title="Создать чат"
          className="bg-blue-700 hover:bg-blue-800 transition-colors rounded-xl"
        >
          <Plus className="text-white size-5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <DialogTitle>Новый чат/тема</DialogTitle>
          <DialogDescription>Укажите название темы/чата и выберите клиента.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="flex flex-col gap-3">
            
            {/* 🚀 2026 BEST PRACTICE: Заменяем Select на выпадающий список с поиском (Combobox) */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">Организация клиента</span>
              <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={isPopoverOpen}
                    disabled={isLoadingOrgs || isPending}
                    className="w-full h-10 justify-between rounded-xl font-medium text-sm border-muted bg-background px-3 hover:bg-background"
                  >
                    <span className={cn("truncate", !selectedOrgId && "text-muted-foreground font-normal")}>
                      {selectedOrgId ? selectedOrgName : "Поиск организации..."}
                    </span>
                    {isLoadingOrgs ? (
                      <Loader className="size-4 animate-spin text-muted-foreground" />
                    ) : (
                      <Building2 className="size-4 text-muted-foreground shrink-0 opacity-70" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 rounded-xl shadow-xl overflow-hidden" align="start">
                  <Command>
                    <CommandInput placeholder="Введите название для поиска..." className="h-10 text-sm" />
                    <CommandList className="max-h-[220px] overflow-y-auto">
                      <CommandEmpty className="py-3 text-center text-xs text-muted-foreground">
                        Организация не найдена
                      </CommandEmpty>
                      <CommandGroup>
                        {organizations.map((org) => (
                          <CommandItem
                            key={org.id}
                            value={org.name} // По этому значению CMDK осуществляет текстовый поиск
                            onSelect={() => {
                              setSelectedOrgId(org.id);
                              setIsPopoverOpen(false);
                            }}
                            className="flex items-center justify-between py-2 px-3 text-sm cursor-pointer rounded-lg mx-1 my-0.5"
                          >
                            <span className="truncate pr-4">{org.name}</span>
                            <Check
                              className={cn(
                                "size-4 text-blue-600 shrink-0",
                                selectedOrgId === org.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">Название темы / Объекта</span>
              <Input
                id="topic-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Например: Проблема с сервером"
                disabled={isPending}
                autoComplete="off"
                required
                className="rounded-xl h-10 border-muted focus-visible:ring-1 focus-visible:ring-primary"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
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
              disabled={!title.trim() || !selectedOrgId || isPending}
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
