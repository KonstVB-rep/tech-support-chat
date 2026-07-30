import { redirect } from "next/navigation"
import { getServerSession } from "@/app/lib/get-session"
import { ButtonSendEmail } from "@/features/auth-send-verification"

const EmailVerify = async () => {
  const session = await getServerSession()
  const user = session?.user

  if (!user) {
    redirect("/")
  }
  if (user.emailVerified) redirect("/dashboard")
  return (
    <div className="grid place-items-center">
      <h1>Подтвердите свой адрес электронной почты</h1>
      <h2>На ваш почтовый ящик было отправлено электронное письмо с подтверждением</h2>
      <ButtonSendEmail email={user.email} />
    </div>
  )
}

export default EmailVerify
