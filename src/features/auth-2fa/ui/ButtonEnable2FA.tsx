"use client";
import { useState } from "react";
import { RefreshCwIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { authClient } from "@/app/lib/auth-client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/shared/ui/card";
import { Field, FieldLabel } from "@/shared/ui/field";
import { Button } from "@/shared/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/shared/ui/input-otp";



const Steps = {
  idle: "idle",
  qr: "qr",
  verify: "verify",
} as const;
type StepsState = keyof typeof Steps;

const ButtonEnable2FA = () => {
  const [step, setStep] = useState<StepsState>(Steps.idle);
  const [totpURI, setTotpURI] = useState("");
  const [backUpCodes, setBackUpCodes] = useState<string[]>([]);
  const [code, setCode] = useState("");
  const router = useRouter();

  const enable2FA = async () => {
    const password = prompt("Введите текущий пароль для подтверждения");
    if (!password) return;

    // Включаем 2FA на сервере
    const { data, error: authError } = await authClient.twoFactor.enable({
      password,
      issuer: "Proffecto Portal", // Твое название приложения
    });

    if (authError) {
      toast.error(authError.message || "Ошибка подтверждения пароля");
      return;
    }

    if (data?.totpURI) {
      setTotpURI(data.totpURI);
      setStep(Steps.qr);
      setBackUpCodes(data.backupCodes || []);
    }
  };
  const verifyInitialCode = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { error } = await authClient.twoFactor.verifyTotp({
      code,
    });

    if (error) {
      toast.error(error.message || "Неверный код");
      return;
    }

    // Очищаем и закрываем/сбрасываем шаг
    setCode("");
    toast.success("2FA успешно активирована!");
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      {step === Steps.idle && (
        <Button onClick={enable2FA} variant="secondary">
          Включить 2FA
        </Button>
      )}

      {step === Steps.qr && (
        <div className="flex flex-col items-center gap-4 p-4 border rounded-lg bg-card">
          <h3 className="font-bold">Шаг 1: Сканирование</h3>
          <p className="text-sm text-muted-foreground text-center">
            Отсканируйте код в Google Authenticator или Яндекс.Ключ
          </p>

          <div className="bg-white p-2 rounded-lg">
            <QRCodeSVG size={200} value={totpURI} />
          </div>
          <div>
            <p>Резервные коды</p>
            <pre>{backUpCodes.join("\n")}</pre>
          </div>
          <Button onClick={() => setStep(Steps.verify)}>
            Я отсканировал, перейти к проверке
          </Button>
        </div>
      )}

      {step === Steps.verify && (
        <div className="flex flex-col items-center gap-4">
          <h3 className="font-bold">Шаг 2: Проверка</h3>
          <form onSubmit={verifyInitialCode}>
            <Card className="mx-auto max-w-max">
              <CardHeader>
                <CardTitle>Verify your login</CardTitle>
                <CardDescription>
                  Enter the verification code we sent to your email address:{" "}
                  <span className="font-medium">m@example.com</span>.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Field>
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor="otp-verification">
                      Verification code
                    </FieldLabel>
                    <Button size="xs" variant="outline">
                      <RefreshCwIcon />
                      Resend Code
                    </Button>
                  </div>
                  <InputOTP
                    id="otp-verification"
                    maxLength={6}
                    onChange={(value) => setCode(value)}
                    required // Добавь это
                    value={code}
                  >
                    <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator className="mx-2" />
                    <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </Field>
              </CardContent>
              <CardFooter>
                <Field>
                  <Button className="w-full" type="submit">
                    Проверить код
                  </Button>
                  <Button
                    className="w-full text-xs"
                    onClick={() => setStep(Steps.qr)}
                    type="button"
                    variant="ghost" // ОБЯЗАТЕЛЬНО, чтобы не сработал сабмит формы
                  >
                    ← Вернуться к QR-коду
                  </Button>
                </Field>
              </CardFooter>
            </Card>
            <p>Введите 8 цифр из приложения для активации</p>
          </form>
        </div>
      )}
    </div>
  );
};

export default ButtonEnable2FA;
