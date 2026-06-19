"use client";
import { AccountDelForm, AvatarChangeForm, NameChangeForm, PasswordChangeForm, SessionManagment } from "@/entities/user";
import ChangeEmailForm from "@/entities/user/ui/ChangeEmailForm";
// import {
//   AccountsCard,
//   AccountSettingsCards,
//   ChangeEmailCard,
//   ChangePasswordCard,
//   DeleteAccountCard,
//   ProvidersCard,
//   SecuritySettingsCards,
//   SessionsCard,
//   TwoFactorCard,
//   UpdateAvatarCard,
//   UpdateNameCard,
//   UpdateUsernameCard,
// } from "@daveyplate/better-auth-ui";



const AccountSetting = () => {
  return (
    <div className="grid gap-4 place-items-center">
      <AvatarChangeForm />

      <NameChangeForm />
      <PasswordChangeForm />

      <SessionManagment />
      <AccountDelForm />

      <ChangeEmailForm />

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
    </div>
  );
};

export default AccountSetting;
