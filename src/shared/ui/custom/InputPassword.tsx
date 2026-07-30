"use client"

import React from "react"
import { Eye, EyeClosed } from "lucide-react" // Убедись, что импорты на месте
import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/components/button" // Твоя кнопка
import { Input } from "@/shared/ui/components/input" // Твой инпут

type InputPasswordProps = React.InputHTMLAttributes<HTMLInputElement>

const InputPassword = React.forwardRef<HTMLInputElement, InputPasswordProps>(
  ({ className, ...props }, ref) => {
    const [visible, setVisible] = React.useState(false)

    return (
      <div className="relative flex w-full items-center">
        <Input
          className={cn("w-full pr-10 placeholder:text-sm", className)}
          id="user_password"
          placeholder="✱✱✱✱✱✱✱"
          ref={ref}
          {...props}
          type={visible ? "text" : "password"}
        />

        <Button
          aria-label="Переключить видимость пароля"
          className="absolute right-1 h-8 w-8 select-none rounded-full"
          onClick={(e) => {
            e.preventDefault()
            setVisible(!visible)
          }}
          size="icon"
          type="button"
          variant="ghost"
        >
          {visible ? <Eye className="size-4" /> : <EyeClosed className="size-4" />}
        </Button>
      </div>
    )
  },
)

InputPassword.displayName = "InputPassword"

export default InputPassword
