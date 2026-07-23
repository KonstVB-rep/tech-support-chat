"use client";

import type React from "react";
import { Loader } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "../button";
import { cn } from "@/shared/lib/utils";

type SubmitButtonProps = { text?: string } & React.ComponentProps<"button">;

const ButtonSubmitForm = ({
  title,
  text,
  className = "w-fit justify-center",
  ...props
}: SubmitButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <Button
      aria-label="Отправить форму"
      className={cn("flex items-center", className)}
      disabled={pending}
      type="submit"
      {...props}
    >
      {pending ? (
        <span className="flex items-center gap-2">
          <Loader className="h-5 w-5 animate-spin" /> {text || title}
        </span>
      ) : (
        title || text
      )}
    </Button>
  );
};

export default ButtonSubmitForm;
