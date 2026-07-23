"use client";

import { useRef } from "react";
import { Camera, Image as ImageIcon, Video, File, X } from "lucide-react";

interface AttachMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onFileSelect: (files: File[]) => void;
}

const AttachMenu = ({ isOpen, onClose, onFileSelect }: AttachMenuProps) => {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFileSelect(files);
      onClose();
    }
    e.target.value = "";
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
      />

      {/* Меню */}
      <div className="absolute bottom-full left-0 right-0 mb-2 bg-background border border-border rounded-xl shadow-lg p-2 z-50">
        <div className="flex items-center justify-between px-2 py-1 border-b border-border mb-2">
          <span className="text-sm font-semibold">Прикрепить</span>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-full">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* 📷 Камера — БЕЗ multiple (камера всегда снимает один кадр) */}
          <button
            onClick={() => cameraInputRef.current?.click()}
            className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-muted transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Camera className="w-6 h-6 text-blue-500" />
            </div>
            <span className="text-xs font-medium">Камера</span>
          </button>

          {/* 🖼️ Галерея — С multiple */}
          <button
            onClick={() => galleryInputRef.current?.click()}
            className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-muted transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-purple-500" />
            </div>
            <span className="text-xs font-medium">Галерея</span>
          </button>

          {/* 📹 Видео — С multiple */}
          <button
            onClick={() => videoInputRef.current?.click()}
            className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-muted transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
              <Video className="w-6 h-6 text-red-500" />
            </div>
            <span className="text-xs font-medium">Видео</span>
          </button>

          {/* 📎 Файл — С multiple */}
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

        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleChange}
          className="hidden"
        />
        {/* ✅ Галерея: multiple */}
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleChange}
          className="hidden"
        />
        {/* ✅ Видео: multiple, без capture (capture заставляет сразу снимать, а не выбирать из галереи) */}
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          multiple
          onChange={handleChange}
          className="hidden"
        />
        {/* ✅ Файл: multiple */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleChange}
          className="hidden"
        />
      </div>
    </>
  );
};

export default AttachMenu;