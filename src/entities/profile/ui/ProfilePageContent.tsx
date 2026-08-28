import type { ProfileData } from "@/entities/profile/ui/ProfileCard"
import ButtonSignOut from "@/features/auth-signout/ui/ButtonSignOut"
import { PushSettingsToggle } from "@/features/pwa-push/ui/PushSettingsToggle"
import { AvatarChangeForm } from "@/features/update-account-info/ui/AvatarChangeForm"
import ChangeEmailForm from "@/features/update-account-info/ui/ChangeEmailForm"
import ChangePhoneForm from "@/features/update-account-info/ui/ChangePhoneForm"
import PasswordChangeForm from "@/features/update-account-info/ui/PasswordChangeForm"

export const ProfilePageContent = ({
  profile,
  isSupport,
}: {
  profile: ProfileData
  isSupport: boolean
}) => {
  return (
    <div className="grid w-full max-w-2xl gap-2">
      <AvatarChangeForm imageUrl={profile.imageUrl} profileId={profile.id} />
      <div className="mx-auto mb-4 w-fit rounded-full border bg-muted px-4 py-2 text-center">
        {profile.name.toUpperCase()}
      </div>
      <ChangeEmailForm emailProfile={profile.email} profileId={profile.id} />
      <ChangePhoneForm phoneProfile={profile.phone} profileId={profile.id} />
      <PasswordChangeForm />
      <PushSettingsToggle
        isStaffMember={isSupport}
        isViewedByAdmin={!isSupport}
        profileId={profile.id}
        pushEnabled={profile.pushEnabled}
        source="account"
      />
      <ButtonSignOut
        className="field-height var mx-auto flex w-full select-none items-center justify-center gap-1 rounded-xl p-2 transition-colors hover:bg-muted/50 hover:text-foreground"
        withIcon={true}
        withText={true}
      />
    </div>
  )
}

export const AccountClientSkeleton = () => {
  return (
    <div className="hidden h-dvh w-full flex-1 flex-col bg-primary-foreground md:flex">
      <div className="flex h-14 shrink-0 items-center border-border/40 border-b bg-background px-4">
        <div className="mx-auto h-5 w-32 rounded-md bg-muted" />
      </div>

      <div className="min-h-0 flex-1 space-y-10 overflow-y-auto bg-background pb-10">
        <div className="mx-auto grid w-full max-w-[600px] place-items-start justify-items-center space-y-4 p-3 md:max-w-2xl">
          <div className="flex w-full flex-col items-center gap-3 rounded-xl border border-border/40 p-4">
            <div className="h-24 w-24 rounded-full bg-muted" />
            <div className="h-9 w-36 rounded-md bg-muted" />
          </div>

          <div className="mx-auto h-10 w-44 rounded-full bg-muted" />

          {[1, 2, 3].map((field) => (
            <div className="w-full space-y-2 rounded-xl border border-border/40 p-4" key={field}>
              <div className="h-4 w-16 rounded-md bg-muted" />
              <div className="h-10 w-full rounded-md bg-muted" />
            </div>
          ))}

          <div className="flex w-full items-center justify-between rounded-xl border border-border/40 p-4">
            <div className="space-y-1">
              <div className="h-4 w-28 rounded-md bg-muted" />
              <div className="h-3 w-40 rounded-md bg-muted" />
            </div>
            <div className="h-6 w-10 rounded-full bg-muted" />
          </div>

          <div className="h-10 w-full rounded-xl bg-muted" />
        </div>
      </div>
    </div>
  )
}
