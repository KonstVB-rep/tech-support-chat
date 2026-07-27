import { ProfileData } from "@/entities/profile/ui/ProfileCard";
import ButtonSignOut from "@/features/auth-signout/ui/ButtonSignOut";
import { PushSettingsToggle } from "@/features/pwa-push/ui/PushSettingsToggle";
import { AvatarChangeForm } from "@/features/update-account-info/ui/AvatarChangeForm";
import ChangeEmailForm from "@/features/update-account-info/ui/ChangeEmailForm";
import ChangePhoneForm from "@/features/update-account-info/ui/ChangePhoneForm";
import PasswordChangeForm from "@/features/update-account-info/ui/PasswordChangeForm";
import { ChevronRight } from "lucide-react";

export const ProfilePageContent = ({
  profile,
  isSupport,
}: {
  profile: ProfileData;
  isSupport: boolean;
}) => {
  return (
    <div className="grid gap-2 w-full max-w-2xl">
      <AvatarChangeForm imageUrl={profile.imageUrl} profileId={profile.id} />
      <div className="text-center w-fit px-4 py-2 border rounded-full mx-auto mb-4 bg-muted">
        {profile.name.toUpperCase()}
      </div>
      <ChangeEmailForm emailProfile={profile.email} profileId={profile.id} />
      <ChangePhoneForm phoneProfile={profile.phone} profileId={profile.id} />
      <PasswordChangeForm />
      <PushSettingsToggle
        profileId={profile.id}
        isSupportEngineer={isSupport}
        pushEnabled={profile.pushEnabled}
        isViewedByAdmin={!isSupport}
        source="account"
      />
      <ButtonSignOut
        className="flex w-full field-height var gap-1 items-center justify-center p-2 rounded-xl select-none transition-colors mx-auto hover:bg-muted/50 hover:text-foreground"
        withIcon={true}
        withText={true}
      />
    </div>
  );
};

export const AccountClientSkeleton = () => {
  return (
    <div className="hidden md:flex flex-col w-full h-dvh bg-primary-foreground flex-1">
      <div className="h-14 border-b border-border/40 flex items-center px-4 bg-background shrink-0">
        <div className="h-5 w-32 bg-muted rounded-md mx-auto" />
      </div>

      <div className="overflow-y-auto space-y-10 flex-1 min-h-0 bg-background pb-10">
        <div className="p-3 w-full grid place-items-start justify-items-center max-w-[600px] md:max-w-2xl mx-auto space-y-4">
          <div className="w-full border border-border/40 rounded-xl p-4 flex flex-col items-center gap-3">
            <div className="w-24 h-24 rounded-full bg-muted" />
            <div className="h-9 w-36 bg-muted rounded-md" />
          </div>

          <div className="h-10 w-44 bg-muted rounded-full mx-auto" />

          {[1, 2, 3].map((field) => (
            <div
              key={field}
              className="w-full border border-border/40 rounded-xl p-4 space-y-2"
            >
              <div className="h-4 w-16 bg-muted rounded-md" />
              <div className="h-10 w-full bg-muted rounded-md" />
            </div>
          ))}

          <div className="w-full border border-border/40 rounded-xl p-4 flex items-center justify-between">
            <div className="space-y-1">
              <div className="h-4 w-28 bg-muted rounded-md" />
              <div className="h-3 w-40 bg-muted rounded-md" />
            </div>
            <div className="h-6 w-10 bg-muted rounded-full" />
          </div>

          <div className="w-full h-10 bg-muted rounded-xl" />
        </div>
      </div>
    </div>
  );
};
