// src/shared/ui/custom/InputPhoneForm.tsx
import { Control, Controller, Path, type FieldValues } from "react-hook-form";
import { Field, FieldLabel } from "../field";
import PhoneInput from "./PhoneInput";

export type InputFormProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  control: Control<T>;
  errorMessage?: string;
  showStarRequired?: boolean;
};

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
            value={String(field.value ?? "")}
            onBlur={field.onBlur}
            onAccept={(val) => field.onChange(val)}
            placeholder="Введите телефон пользователя"
          />
          {errorMessage && (
            <span className="text-red-500 text-xs mt-1">{errorMessage}</span>
          )}
          {fieldState.invalid && !errorMessage && fieldState.error?.message && (
            <span className="text-xs text-destructive mt-1">
              {String(fieldState.error.message)}
            </span>
          )}
        </Field>
      )}
    />
  );
};

export default InputPhoneForm;
