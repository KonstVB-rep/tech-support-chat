"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { changeEmail } from "@/app/actions/auth"
import { Button } from "@/shared/ui/components/button"
import { Input } from "@/shared/ui/components/input"
import { Label } from "@/shared/ui/components/label"

type ChangeEmailResponse = { email: string }

const ChangeEmailForm = ({
  emailProfile,
  profileId,
}: {
  emailProfile: string
  profileId: string
}) => {
  const [email, setEmail] = useState(emailProfile)
  const queryClient = useQueryClient()
  const router = useRouter()

  const { mutate, isPending } = useMutation<ChangeEmailResponse, Error, string>({
    mutationFn: async (newEmail: string) => {
      return await changeEmail(newEmail, profileId)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["session"] })
      toast.success("Email обновлён. Проверьте почту для подтверждения.")
      setEmail(data.email)
      router.refresh()
    },
    onError: (error) => {
      toast.error(error.message || "Ошибка при смене email")
    },
  })

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed) return
    mutate(trimmed)
  }

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <Label htmlFor="email">Электронная почта</Label>
        <Input
          className="field-height"
          disabled={isPending}
          id="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="new@email.com"
          required
          type="email"
          value={email}
        />
      </div>

      <Button className="ml-auto w-fit" disabled={isPending || !email.trim()} type="submit">
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Сохранение...
          </>
        ) : (
          "Сменить email"
        )}
      </Button>
    </form>
  )
}

export default ChangeEmailForm
