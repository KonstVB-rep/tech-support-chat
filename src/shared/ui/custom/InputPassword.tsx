"use client";

import React from "react";
import { Eye, EyeClosed } from "lucide-react"; // Убедись, что импорты на месте
import { Input } from "@/shared/ui/input"; // Твой инпут
import { Button } from "@/shared/ui/button"; // Твоя кнопка
import { cn } from "@/shared/lib/utils";

type InputPasswordProps = React.InputHTMLAttributes<HTMLInputElement>;

const InputPassword = React.forwardRef<HTMLInputElement, InputPasswordProps>(
  ({ className, ...props }, ref) => {
    const [visible, setVisible] = React.useState(false);

    return (
      <div className="relative flex items-center w-full">
        <Input
          ref={ref}
          className={cn("w-full pr-10 placeholder:text-sm", className)}
          id="user_password"
          placeholder="✱✱✱✱✱✱✱"
          {...props}
          type={visible ? "text" : "password"}
        />

        <Button
          aria-label="Переключить видимость пароля"
          className="absolute right-1 h-8 w-8 rounded-full select-none"
          onClick={(e) => {
            e.preventDefault();
            setVisible(!visible);
          }}
          size="icon"
          type="button"
          variant="ghost"
        >
          {visible ? (
            <Eye className="size-4" />
          ) : (
            <EyeClosed className="size-4" />
          )}
        </Button>
      </div>
    );
  },
);

InputPassword.displayName = "InputPassword";

export default InputPassword;
