import type React from "react";
import { Loader } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "./button";
import { cn } from "../lib/utils";


type SubmitButtonProps = { text?: string } & React.ComponentProps<"button">;

const ButtonSubmitForm = ({ title, text,className, ...props }: SubmitButtonProps) => {
  const { pending } = useFormStatus();
  return (
    <Button
      aria-label="Отправить форму"
      className={cn("flex w-full items-center",className)}
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
