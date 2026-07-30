"use client"
import { Pencil, Trash2 } from "lucide-react"
import Image from "next/image"
import type { SupportEngineerWithProfile } from "@/entities/support-engineer/model"
import { DeleteSupportEngineerDialog } from "@/features/manage-support-engineer"
import { UpdateSupportEngineerForm } from "@/features/manage-support-engineer/ui/UpdateSupportEngineerForm"
import { PushSettingsToggle } from "@/features/pwa-push/ui/PushSettingsToggle"
import { Button } from "@/shared/ui/components/button"
import { DrawerComponent } from "@/shared/ui/custom/DrawerComponent"

const EngineerCard = ({ engineer }: { engineer: SupportEngineerWithProfile }) => {
  const userName = engineer.profile.user.name || "Без имени"
  const userEmail = engineer.profile.user.email || ""
  const imageUrl = engineer.profile.imageUrl

  return (
    <div className="group relative mx-auto flex w-full max-w-sm flex-col items-center overflow-hidden rounded-xl border border-border bg-background p-4 text-center shadow-xl transition-all duration-500 hover:shadow-2xl">
      <div className="mt-4 transition-all duration-300 group-hover:scale-105">
        {imageUrl ? (
          <Image
            alt={`Аватар ${userName}`}
            className="h-16 w-16 rounded-full border-2 border-border object-cover"
            height={64}
            src={imageUrl}
            width={64}
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-border bg-muted">
            <svg
              aria-labelledby={`engineer-icon-${engineer.id}`}
              className="h-10 w-10 text-muted-foreground"
              fill="none"
              role="img"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title id={`engineer-icon-${engineer.id}`}>Профиль инженера</title>
              <path
                d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="mt-2">
        <h1 className="font-semibold text-gray-700 dark:text-gray-200">{userName}</h1>
        {userEmail && <p className="text-gray-500 text-sm">{userEmail}</p>}
      </div>

      <div className="mt-3 flex w-full items-center justify-evenly">
        <div className="flex gap-3 rounded-full p-1 text-2xl text-primary shadow-sm">
          <DrawerComponent
            className="px-3 pt-3 pb-6"
            side="bottom"
            trigger={
              <Button
                className="flex h-auto items-center justify-center gap-3 rounded-3xl px-6 py-2"
                variant="outline"
              >
                <span className="sr-only">Открыть меню</span>
                <Trash2 /> / <Pencil />
              </Button>
            }
          >
            <UpdateSupportEngineerForm engineer={engineer} />
            <PushSettingsToggle
              isSupportEngineer={false}
              isViewedByAdmin={true}
              profileId={engineer.profileId}
              pushEnabled={engineer.profile.pushEnabled}
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
  )
}

export default EngineerCard
