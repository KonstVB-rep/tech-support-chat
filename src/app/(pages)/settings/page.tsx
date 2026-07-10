"use client";
import ScreenByType from "../ui/ScreenByType";
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



const Settings = () => {
  return (
    <>
     {/* <aside className="w-full md:w-80 h-full shrink-0 hidden md:block">
        <Sidebar sidebarType={"settings"} />
      </aside> */}

      <main className="flex-1 h-full">
        <ScreenByType screenType={"settings"}/>
      </main>
    </>
  )
}

export default Settings

// const AccountSetting = () => {
//   return (
//     <div className="grid gap-4 place-items-center">
//       <AvatarChangeForm />

//       <NameChangeForm />
//       <PasswordChangeForm />

//       <SessionManagment />
//       <AccountDelForm />

//       <ChangeEmailForm />

//       {/* <SecuritySettingsCards />
//       <AccountSettingsCards />
//       <UpdateAvatarCard />
//       <UpdateUsernameCard />
//       <UpdateNameCard />
//       <ChangeEmailCard />
//       <ChangePasswordCard />
//       <ProvidersCard />
//       <SessionsCard />
//       <TwoFactorCard />
//       <AccountsCard />
//       <DeleteAccountCard /> */}
//     </div>
//   );
// };

// export default AccountSetting;
