"use client"

import type React from "react"
import { useState } from "react"
import type { Profile } from "@prisma/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { ActionStateWithData } from "@/shared/lib/types"
import { Button } from "@/shared/ui/components/button"
import { Label } from "@/shared/ui/components/label"
import PhoneInput from "@/shared/ui/custom/PhoneInput" // Убедитесь, что импорт правильный
import { changePhone } from "../api/changePhone"

const ChangePhoneForm = ({
  phoneProfile,
  profileId,
}: {
  phoneProfile: string | null
  profileId: string
}) => {
  const [phone, setPhone] = useState(phoneProfile)
  const queryClient = useQueryClient()
  const router = useRouter()

  const { mutate, isPending } = useMutation<ActionStateWithData<Profile>, Error, string>({
    mutationFn: async (newPhone: string) => {
      return await changePhone(newPhone, profileId)
    },
    onSuccess: (res) => {
      if (!res.success || !res.data) {
        toast.error(res.error || "Не удалось обновить телефон")
        return
      }

      queryClient.invalidateQueries({ queryKey: ["session"] })
      toast.success("Телефон успешно обновлён.")

      if (res.data.phone) {
        setPhone(res.data.phone)
      }

      router.refresh()
    },
    onError: (error) => {
      toast.error(error.message || "Ошибка при смене телефона")
    },
  })

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = phone?.trim()
    if (!trimmed) return
    mutate(trimmed)
  }

  return (
    <form className="flex w-full max-w-2xl flex-col gap-3" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <Label htmlFor="phone">Телефон</Label>

        <PhoneInput
          className="field-height dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 dark:disabled:bg-input/80"
          onAccept={(value) => setPhone(value)}
          required
          value={phone ?? ""}
        />
      </div>

      <Button className="ml-auto w-fit" disabled={isPending || !phone?.trim()} type="submit">
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Сохранение...
          </>
        ) : (
          "Сменить телефон"
        )}
      </Button>
    </form>
  )
}

export default ChangePhoneForm
