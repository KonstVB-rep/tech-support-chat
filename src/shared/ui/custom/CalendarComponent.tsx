"use client"

import { Calendar } from "@/shared/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { ru } from "react-day-picker/locale";
import { FieldValues } from "react-hook-form";
import { Button } from "../button";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { cn } from "@/shared/lib/utils";

type CalendarComponentProps = {
     field: FieldValues;
}

export const CalendarComponent =({ field}: CalendarComponentProps) => {
  const rawValue = field.value as string | undefined;
  const selectedDate = rawValue ? new Date(rawValue) : undefined;
  const [timeZone, setTimeZone] = useState<string | undefined>(undefined)
 
  useEffect(() => {
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone)
  }, [])

  return (
    <Popover>
      <PopoverTrigger asChild>
          <Button
            className={cn(
              "w-full text-left font-normal field-height",
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
            mode="single"
            captionLayout="dropdown"
            locale={ru}
            onSelect={(date: Date | undefined) => {
                    field.onChange(date || null);
                }}
            selected={selectedDate}
            timeZone={timeZone}
            className="rounded-lg border"
            />
      </PopoverContent>
    </Popover>
  )
}
