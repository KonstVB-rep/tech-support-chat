"use client"

import { useRef, useState } from "react"
import { Camera, Loader2, X } from "lucide-react"
import Image from "next/image"
import { compressImage } from "@/shared/lib/image-compressor"
import { Button } from "@/shared/ui/components/button"
import { Label } from "@/shared/ui/components/label"
import AvatarUser from "../../../entities/user/ui/AvatarUser"
import { useAvatarChange } from "../api/useAvatarChange"

export const AvatarChangeForm = ({
  imageUrl,
  profileId,
}: {
  imageUrl: string | null
  profileId: string
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    imageUrl || "https://github.com/shadcn.png",
  )

  const { upload, remove } = useAvatarChange(profileId)
  const isPending = upload.isPending || remove.isPending

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(URL.createObjectURL(file))

    const compressed = await compressImage(file, 256, 0.8)
    upload.mutate(compressed)
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault()
    setPreviewUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
    remove.mutate()
  }

  return (
    <div className="flex flex-col items-center gap-3 px-4 py-4 pb-2">
      <Label className="group relative cursor-pointer" htmlFor="avatar-upload">
        <div className="relative h-24 w-24 rounded-full border-2 border-border transition-opacity group-hover:opacity-80">
          {previewUrl && (
            <Button
              className="-top-2 -right-1 absolute rounded-full border-red-300 hover:border-red-500 focus-visible:border-red-500"
              disabled={isPending}
              onClick={handleRemove}
              size="icon"
              variant="destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          )}

          {previewUrl ? (
            <Image
              alt="Превью аватара"
              className="h-full w-full rounded-full object-cover"
              height={96}
              src={previewUrl}
              width={96}
            />
          ) : (
            <AvatarUser />
          )}

          {isPending && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
              <Loader2 className="h-6 w-6 animate-spin text-white" />
            </div>
          )}

          {!isPending && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100">
              <Camera className="h-6 w-6 text-white drop-shadow-md" />
            </div>
          )}
        </div>
      </Label>

      <input
        accept="image/png, image/jpeg, image/webp"
        className="field-height hidden"
        disabled={isPending}
        id="avatar-upload"
        onChange={handleFileChange}
        ref={fileInputRef}
        type="file"
      />

      <p className="text-muted-foreground text-xs">
        {isPending ? "Загрузка..." : "Нажмите на аватар чтобы изменить"}
      </p>
    </div>
  )
}
