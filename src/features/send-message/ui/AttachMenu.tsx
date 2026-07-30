"use client"

import { useRef } from "react"
import { Camera, File, Image as ImageIcon, Video, X } from "lucide-react"
import { Button } from "@/shared/ui/components/button"

interface AttachMenuProps {
  isOpen: boolean
  onClose: () => void
  onFileSelect: (files: File[]) => void
}

const AttachMenu = ({ isOpen, onClose, onFileSelect }: AttachMenuProps) => {
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      onFileSelect(files)
      onClose()
    }
    e.target.value = ""
  }

  return (
    <>
      {/* biome-ignore lint/a11y/noStaticElementInteractions: backdrop overlay for mobile menu close */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop is not a keyboard-interactive element */}
      <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={onClose} />

      {/* Меню */}
      <div className="absolute right-0 bottom-full left-0 z-50 mb-2 rounded-xl border border-border bg-background p-2 shadow-lg">
        <div className="mb-2 flex items-center justify-between border-border border-b px-2 py-1">
          <span className="font-semibold text-sm">Прикрепить</span>
          <Button
            className="rounded-full p-1 hover:bg-muted"
            onClick={onClose}
            size="icon"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* 📷 Камера — БЕЗ multiple (камера всегда снимает один кадр) */}
          <Button
            className="flex flex-col items-center gap-2 rounded-lg p-4 transition-colors hover:bg-muted"
            onClick={() => cameraInputRef.current?.click()}
            variant="ghost"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
              <Camera className="h-6 w-6 text-blue-500" />
            </div>
            <span className="font-medium text-xs">Камера</span>
          </Button>

          {/* 🖼️ Галерея — С multiple */}
          <Button
            className="flex flex-col items-center gap-2 rounded-lg p-4 transition-colors hover:bg-muted"
            onClick={() => galleryInputRef.current?.click()}
            variant="ghost"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10">
              <ImageIcon className="h-6 w-6 text-purple-500" />
            </div>
            <span className="font-medium text-xs">Галерея</span>
          </Button>

          {/* 📹 Видео — С multiple */}
          <Button
            className="flex flex-col items-center gap-2 rounded-lg p-4 transition-colors hover:bg-muted"
            onClick={() => videoInputRef.current?.click()}
            variant="ghost"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
              <Video className="h-6 w-6 text-red-500" />
            </div>
            <span className="font-medium text-xs">Видео</span>
          </Button>

          {/* 📎 Файл — С multiple */}
          <Button
            className="flex flex-col items-center gap-2 rounded-lg p-4 transition-colors hover:bg-muted"
            onClick={() => fileInputRef.current?.click()}
            variant="ghost"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
              <File className="h-6 w-6 text-green-500" />
            </div>
            <span className="font-medium text-xs">Файл</span>
          </Button>
        </div>

        <input
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleChange}
          ref={cameraInputRef}
          type="file"
        />
        {/* ✅ Галерея: multiple */}
        <input
          accept="image/*"
          className="hidden"
          multiple
          onChange={handleChange}
          ref={galleryInputRef}
          type="file"
        />
        {/* ✅ Видео: multiple, без capture (capture заставляет сразу снимать, а не выбирать из галереи) */}
        <input
          accept="video/*"
          className="hidden"
          multiple
          onChange={handleChange}
          ref={videoInputRef}
          type="file"
        />
        {/* ✅ Файл: multiple */}
        <input className="hidden" multiple onChange={handleChange} ref={fileInputRef} type="file" />
      </div>
    </>
  )
}

export default AttachMenu
