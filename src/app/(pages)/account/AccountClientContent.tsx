'use client';

import { ProfileData } from '@/entities/profile/ui/ProfileCard';
import { SidebarProfileList } from '@/entities/profile/ui/SidebarProfileList';
import { AccountDelForm, AvatarChangeForm, ChangeEmailForm, PasswordChangeForm } from "@/entities/user";
import { checkIsSupportActionNyProfileId } from '@/entities/user/api/checkIsSupportAction';
import ActiveSessions from '@/entities/user/ui/SessionManagment';
import ButtonSignOut from '@/features/auth-signout/ui/ButtonSignOut';
import { PushSettingsToggle } from '@/features/pwa-push/ui/PushSettingsToggle';
import WrapperHeaderScreen from "@/shared/ui/custom/WrapperHeaderScreen";
import {  useState } from 'react';
import { useQuery } from '@tanstack/react-query';

const AccountClientContent = ({profile}:{profile: ProfileData}) => {

  const [activeScreen, setActiveScreen] = useState("profile");

  const { data: isSupport = false, isLoading } = useQuery({
  queryKey: ["current-user-is-support"],
  queryFn: () => checkIsSupportActionNyProfileId(profile.id),
  staleTime: 10 * 60 * 1000, 
});

  return (
    <>
        <aside className="w-full md:w-80 h-full shrink-0 hidden md:block bg-sidebar pt-16">
          <SidebarProfileList setActiveScreen={setActiveScreen}/>
        </aside>
        <div className="flex flex-col w-full h-full bg-primary-foreground">
          <WrapperHeaderScreen><h2 className="text-center font-semibold uppercase w-full">Управление профилем</h2></WrapperHeaderScreen>
          <div className="overflow-y-auto space-y-10 flex-1 h-full bg-background">
              <div className="p-3 w-full grid place-items-start justify-items-center">
              {activeScreen === "profile" && <div className="grid gap-3 w-full max-w-2xl">
                <AvatarChangeForm imageUrl={profile.imageUrl} profileId={profile.id}/>
                <ChangeEmailForm emailProfile={profile.email} profileId={profile.id}/>
                <PasswordChangeForm />
                <PushSettingsToggle profileId={profile.id} isSupportEngineer={!isSupport} pushEnabled={profile.pushEnabled} isViewedByAdmin={false} />
                <ButtonSignOut className="flex w-full h-10 var gap-1 items-center justify-center p-2 rounded-xl select-none transition-colors mx-auto hover:bg-muted/50 hover:text-foreground" withIcon={true} withText={true}/>
              </div>}

             {activeScreen === "session" && <ActiveSessions />}
             {activeScreen === "accountDel" && <AccountDelForm />}

            </div>
          </div>
        </div>
    </>
  )
}

export default AccountClientContent