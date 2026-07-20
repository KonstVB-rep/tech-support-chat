"use client";
import Image from "next/image";
import { SupportEngineerWithProfile } from "@/entities/support-engineer/model";
import { DrawerComponent } from "@/shared/ui/custom/DrawerComponent";
import { Button } from "@/shared/ui/button";
import { DeleteSupportEngineerDialog } from "@/features/manage-support-engineer";
import { UpdateSupportEngineerForm } from "@/features/manage-support-engineer/ui/UpdateSupportEngineerForm";
import { PushSettingsToggle } from "@/features/pwa-push/ui/PushSettingsToggle";
import { Eye, Pencil, Trash2 } from "lucide-react";

const EngineerCard = ({
  engineer,
}: {
  engineer: SupportEngineerWithProfile;
}) => {
  const userName = engineer.profile.user.name || "Без имени";
  const userEmail = engineer.profile.user.email || "";
  const imageUrl = engineer.profile.imageUrl;

  return (
    <div className="rounded-xl overflow-hidden relative text-center p-4 group items-center flex flex-col max-w-sm mx-auto w-full hover:shadow-2xl transition-all duration-500 shadow-xl bg-background border border-border">
      <div className="mt-4 group-hover:scale-105 transition-all duration-300">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`Аватар ${userName}`}
            width={64}
            height={64}
            className="w-16 h-16 rounded-full object-cover border-2 border-border"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center border-2 border-border">
            <svg
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-labelledby={`engineer-icon-${engineer.id}`}
              className="w-10 h-10 text-muted-foreground"
            >
              <title id={`engineer-icon-${engineer.id}`}>
                Профиль инженера
              </title>
              <path
                d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="mt-2">
        <h1 className="font-semibold text-gray-700 dark:text-gray-200">
          {userName}
        </h1>
        {userEmail && <p className="text-gray-500 text-sm">{userEmail}</p>}
      </div>

      <div className="flex items-center justify-evenly w-full mt-3">
        <div className="flex gap-3 text-2xl text-primary p-1  rounded-full shadow-sm">
          <DrawerComponent
            trigger={
              <Button
                variant="outline"
                className="flex items-center justify-center gap-3 px-6 py-2 rounded-3xl h-auto"
              >
                <span className="sr-only">Открыть меню</span>
                <Trash2 /> / <Pencil />
              </Button>
            }
            side="bottom"
            className="px-3 pt-3 pb-6"
          >
            <UpdateSupportEngineerForm engineer={engineer} />
            <PushSettingsToggle
              profileId={engineer.profileId}
              isSupportEngineer={false}
              pushEnabled={engineer.profile.pushEnabled}
              isViewedByAdmin={true}
              source="admin-staff"
            />
            <DeleteSupportEngineerDialog
              engineerIds={engineer.id}
              engineerName={engineer.profile?.name}
            />
          </DrawerComponent>
        </div>
      </div>
    </div>
  );
};

export default EngineerCard;
