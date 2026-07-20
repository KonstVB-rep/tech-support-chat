"use client";

import { useRef, useState } from "react";
import { Label } from "@/shared/ui/label";
import { Loader2, Camera, X } from "lucide-react";
import AvatarUser from "./AvatarUser";
import { compressImage } from "@/shared/lib/image-compressor";
import { Button } from "@/shared/ui/button";
import { useAvatarChange } from "../api/useAvatarChange";

export const AvatarChangeForm = ({
  imageUrl,
  profileId,
}: {
  imageUrl: string | null;
  profileId: string;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    imageUrl || "https://github.com/shadcn.png",
  );

  const { upload, remove } = useAvatarChange(profileId);
  const isPending = upload.isPending || remove.isPending;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));

    const compressed = await compressImage(file, 256, 0.8);
    upload.mutate(compressed);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    remove.mutate();
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <Label htmlFor="avatar-upload" className="cursor-pointer group relative">
        <div className="relative h-24 w-24 rounded-full border-2 border-border transition-opacity group-hover:opacity-80">
          {previewUrl && (
            <Button
              size="icon"
              variant="destructive"
              className="absolute -top-2 -right-1 rounded-full border-red-300 hover:border-red-500 focus-visible:border-red-500"
              onClick={handleRemove}
              disabled={isPending}
            >
              <X className="h-4 w-4" />
            </Button>
          )}

          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="h-full w-full rounded-full object-cover"
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
        ref={fileInputRef}
        id="avatar-upload"
        type="file"
        accept="image/png, image/jpeg, image/webp"
        className="hidden field-height"
        onChange={handleFileChange}
        disabled={isPending}
      />

      <p className="text-xs text-muted-foreground">
        {isPending ? "Загрузка..." : "Нажмите на аватар чтобы изменить"}
      </p>
    </div>
  );
};
