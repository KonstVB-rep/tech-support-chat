"use client"

import { useEffect, useState } from "react"
import { CalendarIcon } from "lucide-react"
import { ru } from "react-day-picker/locale"
import type { FieldValues } from "react-hook-form"
import { cn } from "@/shared/lib/utils"
import { Calendar } from "@/shared/ui/components/calendar"
import { Button } from "../components/button"
import { Popover, PopoverContent, PopoverTrigger } from "../components/popover"

type CalendarComponentProps = {
  field: FieldValues
}

export const CalendarComponent = ({ field }: CalendarComponentProps) => {
  const rawValue = field.value as string | undefined

  const selectedDate = rawValue ? new Date(rawValue) : undefined

  const [timeZone, setTimeZone] = useState<string | undefined>(undefined)

  useEffect(() => {
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone)
  }, [])

  return (
    <>
      <input name={field.name} type="hidden" value={rawValue ?? ""} />
      <Popover>
        <PopoverTrigger asChild>
          <Button
            className={cn(
              "field-height w-full text-left font-normal",
              !field.value && "text-muted-foreground",
            )}
            variant={"outline"}
          >
            {selectedDate ? (
              Intl.DateTimeFormat("ru").format(selectedDate)
            ) : (
              <span>Выберите дату</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            captionLayout="dropdown"
            className="rounded-lg border"
            locale={ru}
            mode="single"
            onSelect={(date: Date | undefined) => {
              const stringDate = date?.toISOString().split("T")[0] // Получаем "2026-07-25"
              field.onChange(stringDate)
            }}
            selected={selectedDate}
            timeZone={timeZone}
          />
        </PopoverContent>
      </Popover>
    </>
  )
}
