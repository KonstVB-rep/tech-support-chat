import type React from "react";
import { IMaskInput } from "react-imask";
import { cn } from "@/shared/lib/utils";

interface PhoneInputProps extends React.HTMLAttributes<HTMLInputElement> {
  mask?: string;
  className?: string;
  onAccept?: (value: string) => void;
  value?: string;
  placeholder?: string;
  required?: boolean;
  error?: boolean;
}

const PhoneInput = ({
  className,
  mask = "+{7}(000)000-00-00 доб. 0000000000",
  value,
  onAccept,
  placeholder,
  required,
  ...props
}: PhoneInputProps) => {
  return (
    <IMaskInput
      className={cn(
        "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      mask={mask}
      onAccept={onAccept}
      placeholder={placeholder}
      required={required}
      value={value}
      {...props}
    />
  );
};

export default PhoneInput;
