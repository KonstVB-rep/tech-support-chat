import { AccountDelForm, AvatarChangeForm, ChangeEmailForm, PasswordChangeForm, SessionManagment } from "@/entities/user"
import WrapperHeaderScreen from "@/shared/ui/custom/WrapperHeaderScreen"
import WrapperScreen from "@/shared/ui/custom/WrapperScreen"
import { ModeToggle } from "@/shared/ui/mode-toggle"

const SettingsWindow = () => {
  return (
    <WrapperScreen>
        <WrapperHeaderScreen>
          <h2 className="text-center font-semibold uppercase w-full">Редактировать профиль</h2>
         <ModeToggle/>
        </WrapperHeaderScreen>
      <div className="flex flex-col items-center gap-4 p-4 w-full bg-card">

        <AvatarChangeForm />

      <PasswordChangeForm />

      <SessionManagment />
      <AccountDelForm />

      <ChangeEmailForm />
      </div>

      {/* <SecuritySettingsCards />
      <AccountSettingsCards />
      <UpdateAvatarCard />
      <UpdateUsernameCard />
      <UpdateNameCard />
      <ChangeEmailCard />
      <ChangePasswordCard />
      <ProvidersCard />
      <SessionsCard />
      <TwoFactorCard />
      <AccountsCard />
      <DeleteAccountCard /> */}
    </WrapperScreen>
  )
}

export default SettingsWindow