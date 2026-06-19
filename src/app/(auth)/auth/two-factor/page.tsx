"use client"

import { useState } from "react"
import { RefreshCwIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { authClient } from "@/app/lib/auth-client"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/shared/ui/card"
import { Field, FieldLabel } from "@/shared/ui/field"
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/shared/ui/input-otp"
import { Button } from "@/shared/ui/button"



export default function TwoFactor() {
  const [code, setCode] = useState("")
  const router = useRouter()

  const verifyInitialCode = async (e: React.SubmitEvent<HTMLFormElement>) => {
    // Теперь TypeScript знает про preventDefault()
    e.preventDefault()

    const { error } = await authClient.twoFactor.verifyTotp({
      code,
      trustDevice: false,
    })

    if (error) {
      toast.error(error.message || "Неверный код")
      return
    }

    setCode("")
    router.replace("/")
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
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
                  <FieldLabel htmlFor="otp-verification">Verification code</FieldLabel>
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
              </Field>
            </CardFooter>
          </Card>
          <p>Введите 8 цифр из приложения для активации</p>
        </form>
      </div>
    </div>
  )
}
