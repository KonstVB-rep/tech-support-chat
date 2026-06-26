import { AccountDelForm, AvatarChangeForm, ChangeEmailForm, NameChangeForm, PasswordChangeForm, SessionManagment } from "@/entities/user"
import WrapperHeaderScreen from "@/shared/ui/custom/WrapperHeaderScreen"
import WrapperScreen from "@/shared/ui/custom/WrapperScreen"

const SettingsWindow = () => {
  return (
    <WrapperScreen>
        <WrapperHeaderScreen>
        <h2 className="text-center font-semibold uppercase w-full">Редактировать профиль</h2>
        </WrapperHeaderScreen>
      <div className="flex flex-col items-center gap-4 p-4 w-full">
        <AvatarChangeForm />

      <NameChangeForm />
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