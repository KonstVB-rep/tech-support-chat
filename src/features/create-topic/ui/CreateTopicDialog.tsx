// src/features/create-topic/ui/CreateTopicDialog.tsx
"use client"
import { useState } from "react"
import { Building2, Check, Loader, Plus } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/components/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/ui/components/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/components/dialog"
import { Input } from "@/shared/ui/components/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/components/popover"
import { useCreateTopic } from "../api/useCreateTopic"
import { useGetOrganizationsList } from "../api/useGetOrganizationsList"

const CreateTopicDialog = () => {
  const [title, setTitle] = useState("")
  const [selectedOrgId, setSelectedOrgId] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  // Дополнительный стейт для открытия выпадающего списка поиска
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  const { mutate: createTopic, isPending } = useCreateTopic()

  const { data: organizations = [], isLoading: isLoadingOrgs } = useGetOrganizationsList(isOpen)

  // Находим имя выбранной организации, чтобы отобразить его на кнопке триггера
  const selectedOrgName = organizations.find((org) => org.id === selectedOrgId)?.name

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const trimmedTitle = title.trim()

    if (!trimmedTitle || !selectedOrgId || isPending) {
      toast.error("Заполните все поля: название, организация")
      return
    }

    createTopic(
      {
        title: trimmedTitle,
        organizationId: selectedOrgId,
      },
      {
        onSuccess: () => {
          toast.success("Чат по объекту успешно создан!")
          setTitle("")
          setSelectedOrgId("") // Сбрасываем выбранную компанию
          setIsOpen(false)
        },
        onError: (error) => {
          toast.error(error.message)
        },
      },
    )
  }

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button
          className="rounded-xl bg-blue-700 transition-colors hover:bg-blue-800"
          size="icon"
          title="Создать чат"
        >
          <Plus className="size-5 text-white" />
        </Button>
      </DialogTrigger>

      <DialogContent className="rounded-2xl sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Новый чат/тема</DialogTitle>
          <DialogDescription>Укажите название темы/чата и выберите клиента.</DialogDescription>
        </DialogHeader>

        <form className="space-y-3 pt-2" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-3">
            {/* 🚀 2026 BEST PRACTICE: Заменяем Select на выпадающий список с поиском (Combobox) */}
            <div className="flex flex-col gap-1.5">
              <span className="font-medium text-muted-foreground text-xs">Организация клиента</span>
              <Popover onOpenChange={setIsPopoverOpen} open={isPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    aria-expanded={isPopoverOpen}
                    className="h-10 w-full justify-between rounded-xl border-muted bg-background px-3 font-medium text-sm hover:bg-background"
                    disabled={isLoadingOrgs || isPending}
                    role="combobox"
                    variant="outline"
                  >
                    <span
                      className={cn(
                        "truncate",
                        !selectedOrgId && "font-normal text-muted-foreground",
                      )}
                    >
                      {selectedOrgId ? selectedOrgName : "Поиск организации..."}
                    </span>
                    {isLoadingOrgs ? (
                      <Loader className="size-4 animate-spin text-muted-foreground" />
                    ) : (
                      <Building2 className="size-4 shrink-0 text-muted-foreground opacity-70" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  className="w-[var(--radix-popover-trigger-width)] overflow-hidden rounded-xl p-0 shadow-xl"
                >
                  <Command>
                    <CommandInput
                      className="h-10 text-sm"
                      placeholder="Введите название для поиска..."
                    />
                    <CommandList className="max-h-[220px] overflow-y-auto">
                      <CommandEmpty className="py-3 text-center text-muted-foreground text-xs">
                        Организация не найдена
                      </CommandEmpty>
                      <CommandGroup>
                        {organizations.map((org) => (
                          <CommandItem
                            className="mx-1 my-0.5 flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm"
                            key={org.id} // По этому значению CMDK осуществляет текстовый поиск
                            onSelect={() => {
                              setSelectedOrgId(org.id)
                              setIsPopoverOpen(false)
                            }}
                            value={org.name}
                          >
                            <span className="truncate pr-4">{org.name}</span>
                            <Check
                              className={cn(
                                "size-4 shrink-0 text-blue-600",
                                selectedOrgId === org.id ? "opacity-100" : "opacity-0",
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
              <span className="font-medium text-muted-foreground text-xs">
                Название темы / Объекта
              </span>
              <Input
                autoComplete="off"
                className="h-10 rounded-xl border-muted focus-visible:ring-1 focus-visible:ring-primary"
                disabled={isPending}
                id="topic-title"
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Например: Проблема с сервером"
                required
                type="text"
                value={title}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 pt-2 sm:gap-0">
            <Button
              className="rounded-xl"
              disabled={isPending}
              onClick={() => setIsOpen(false)}
              type="button"
              variant="ghost"
            >
              Отмена
            </Button>
            <Button
              className="rounded-xl px-5"
              disabled={!title.trim() || !selectedOrgId || isPending}
              type="submit"
            >
              {isPending ? "Создание..." : "Открыть тему"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateTopicDialog
