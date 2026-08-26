// src/shared/ui/custom/InputPhoneForm.tsx
import { type Control, Controller, type FieldValues, type Path } from "react-hook-form"
import { Field, FieldLabel } from "../components/field"
import PhoneInput from "./PhoneInput"

export type InputFormProps<T extends FieldValues> = {
  name: Path<T>
  label: string
  control: Control<T>
  errorMessage?: string
  showStarRequired?: boolean
}

const InputPhoneForm = <T extends FieldValues>({
  name,
  label,
  control,
  errorMessage,
  showStarRequired,
}: InputFormProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>
            {label}
            {showStarRequired && <span className="text-destructive">*</span>}
          </FieldLabel>
          <PhoneInput
            name={field.name}
            onAccept={(val) => field.onChange(val)}
            onBlur={field.onBlur}
            placeholder="Введите телефон пользователя"
            value={String(field.value ?? "")}
          />
          {errorMessage && <span className="mt-1 text-red-500 text-xs">{errorMessage}</span>}
          {fieldState.invalid && !errorMessage && fieldState.error?.message && (
            <span className="mt-1 text-destructive text-xs">
              {String(fieldState.error.message)}
            </span>
          )}
        </Field>
      )}
    />
  )
}

export default InputPhoneForm
