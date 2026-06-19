"use client"
import { sendVerificationEmail } from "@/app/actions/auth";
import ButtonSubmitForm from "@/shared/ui/ButtonSubmitForm";

import { useActionState } from "react";


const ButtonSendEmail = ({ email }: { email: string }) => {
  // state здесь пригодится для вывода ошибок или успеха
  const [state, formAction] = useActionState(sendVerificationEmail, undefined);

  return (
    <form action={formAction}>
      <input name="email" type="hidden" value={email} />

      <ButtonSubmitForm text="Повторно отправить подтверждение" />

      {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
      {state?.success && (
        <p className="text-green-500 text-sm">Письмо отправлено!</p>
      )}
    </form>
  );
};

export default ButtonSendEmail;
