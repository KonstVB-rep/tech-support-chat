import { Control, Controller, Path, type FieldValues } from "react-hook-form";
import { Field, FieldLabel } from "../field";
import PhoneInput from "./PhoneInput";
export type InputFormProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  control: Control<T>;
  errorMessage?: string;
  showStarRequired?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

const InputPhoneForm = <T extends FieldValues>({
  name,
  label,
  control,
  errorMessage,
  ...rest
}: InputFormProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const fieldProps = {
          ...field,
          ref: undefined,
          inputRef: field.ref,
        };
        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="phone">Телефон</FieldLabel>
            <PhoneInput
              onAccept={field.onChange}
              placeholder="Введите телефон пользователя"
              {...fieldProps}
              {...rest}
              value={field.value as string}
            />
            {errorMessage && (
              <span className="text-red-500">{errorMessage}</span>
            )}
          </Field>
        );
      }}
    />
  );
};

export default InputPhoneForm;
