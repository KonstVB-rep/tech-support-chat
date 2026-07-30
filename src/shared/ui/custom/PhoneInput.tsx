// src/shared/ui/custom/PhoneInput.tsx

import { useEffect, useRef } from "react"
import type { InputMask } from "imask"
import { IMaskInput } from "react-imask"
import { cn } from "@/shared/lib/utils"

interface PhoneInputProps {
  mask?: string
  className?: string
  onAccept?: (value: string) => void
  value?: string
  placeholder?: string
  required?: boolean
  error?: boolean
  disabled?: boolean
  name?: string
  onBlur?: () => void
}

const PhoneInput = ({
  className,
  mask = "+{7}(000)000-00-00 доб. 0000000000",
  value,
  onAccept,
  placeholder,
  required,
  error,
  disabled,
  name,
  onBlur,
}: PhoneInputProps) => {
  const maskRef = useRef<InputMask | null>(null)

  useEffect(() => {
    if (maskRef.current && value !== undefined) {
      const currentValue = maskRef.current.value
      if (currentValue !== value) {
        maskRef.current.value = value
      }
    }
  }, [value])

  return (
    <IMaskInput
      className={cn(
        "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
        error && "border-destructive focus-visible:ring-destructive",
        className,
      )}
      defaultValue={value ?? ""}
      disabled={disabled}
      inputRef={(el) => {
        if (el) {
          maskRef.current = (el as unknown as { mask: InputMask }).mask ?? null
        }
      }}
      mask={mask}
      name={name}
      onAccept={onAccept}
      onBlur={onBlur}
      placeholder={placeholder}
      required={required}
      unmask={false}
    />
  )
}

export default PhoneInput
