// src/features/send-message/ui/AttachMenu.tsx
"use client";

import { useRef } from "react";
import { Camera, Image, Video, File, X } from "lucide-react";

interface AttachMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onFileSelect: (file: File) => void;
}

const AttachMenu = ({ isOpen, onClose, onFileSelect }: AttachMenuProps) => {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
      onClose();
    }
  };

  return (
    <>
      {/* Затемнение фона */}
      <div
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
      />

      {/* Меню */}
      <div className="absolute bottom-full left-0 right-0 mb-2 bg-background border border-border rounded-xl shadow-lg p-2 z-50">
        <div className="flex items-center justify-between px-2 py-1 border-b border-border mb-2">
          <span className="text-sm font-semibold">Прикрепить</span>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* 📷 Камера */}
          <button
            onClick={() => cameraInputRef.current?.click()}
            className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-muted transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Camera className="w-6 h-6 text-blue-500" />
            </div>
            <span className="text-xs font-medium">Камера</span>
          </button>

          {/* 🖼️ Галерея */}
          <button
            onClick={() => galleryInputRef.current?.click()}
            className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-muted transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
              <Image className="w-6 h-6 text-purple-500" />
            </div>
            <span className="text-xs font-medium">Галерея</span>
          </button>

          {/* 📹 Видео */}
          <button
            onClick={() => videoInputRef.current?.click()}
            className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-muted transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
              <Video className="w-6 h-6 text-red-500" />
            </div>
            <span className="text-xs font-medium">Видео</span>
          </button>

          {/* 📎 Файл */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-muted transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
              <File className="w-6 h-6 text-green-500" />
            </div>
            <span className="text-xs font-medium">Файл</span>
          </button>
        </div>

        {/* Скрытые input'ы */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleChange}
          className="hidden"
        />
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          capture="environment"
          onChange={handleChange}
          className="hidden"
        />
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleChange}
          className="hidden"
        />
      </div>
    </>
  );
};

export default AttachMenu;