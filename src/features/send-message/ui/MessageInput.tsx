// src/features/send-message/ui/MessageInput.tsx
"use client";

import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useActiveTicketId } from "@/store/useChatStore";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { getSocket } from "@/shared/lib/socket";

import { Paperclip, X, Send, Plus } from "lucide-react";
import AttachMenu from "./AttachMenu";
import { compressImage } from "@/shared/lib/image-compressor";
import { useUploadFile } from "../api/useUploadFile";

interface Message {
  id: string;
  text: string;
  chatId: string;
  profileId: string;
  createdAt: string;
  fileUrl?: string | null;
  fileType?: string | null;
  fileName?: string | null;
  profile?: {
    id: string;
    name: string;
    userId: string;
  };
}

const MessageInput = () => {
  const [text, setText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const activeTicketId = useActiveTicketId();
  const queryClient = useQueryClient();

  const uploadMutation = useUploadFile();

  const sendMessageMutation = useMutation({
    mutationFn: async (text: string) => {
      if (!activeTicketId) throw new Error("Нет активного чата");

      const res = await fetch(`/api/chats/${activeTicketId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error("Ошибка отправки");
      return res.json();
    },
    onSuccess: (data) => {
      const message = data.message;

      queryClient.setQueryData<Message[]>(
        ["messages", activeTicketId],
        (old) => {
          if (!old) return [message];
          if (old.some((m) => m.id === message.id)) return old;
          return [...old, message];
        }
      );

      const socket = getSocket();
      if (socket?.connected) {
        socket.emit("message:new", message);
      }

      setText("");
    },
  });

  // 🆕 Обработка выбора файла с сжатием
  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);

    // Сжимаем картинки
    if (file.type.startsWith("image/")) {
      setIsCompressing(true);
      try {
        const compressed = await compressImage(file);
        setSelectedFile(compressed);

        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(compressed);
      } catch (err) {
        console.error("Ошибка сжатия:", err);
        // Если не удалось сжать - используем оригинал
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(file);
      } finally {
        setIsCompressing(false);
      }
    } else if (file.type.startsWith("video/")) {
      // Для видео просто превью
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedFile && activeTicketId) {
      uploadMutation.mutate(
        {
          chatId: activeTicketId,
          file: selectedFile,
          text: text.trim() || undefined,
        },
        {
          onSuccess: () => {
            setText("");
            removeFile();
          },
        }
      );
    } else if (text.trim()) {
      sendMessageMutation.mutate(text.trim());
    }
  };

  if (!activeTicketId) return null;

  const isPending =
    uploadMutation.isPending || sendMessageMutation.isPending || isCompressing;

  return (
    <div className="border-t border-border bg-background p-3 md:p-4 relative">
      {/* Меню прикрепления */}
      <AttachMenu
        isOpen={showAttachMenu}
        onClose={() => setShowAttachMenu(false)}
        onFileSelect={handleFileSelect}
      />

      {/* Превью файла */}
      {selectedFile && (
        <div className="mb-3 relative inline-block">
          {preview && selectedFile.type.startsWith("image/") ? (
            <img
              src={preview}
              alt="preview"
              className="max-h-32 md:max-h-48 rounded-lg border border-border"
            />
          ) : preview && selectedFile.type.startsWith("video/") ? (
            <video
              src={preview}
              controls
              className="max-h-32 md:max-h-48 rounded-lg border border-border"
            />
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
              <Paperclip className="w-4 h-4" />
              <span className="text-sm truncate max-w-[200px]">
                {selectedFile.name}
              </span>
              <span className="text-xs text-muted-foreground">
                ({(selectedFile.size / 1024 / 1024).toFixed(2)} МБ)
              </span>
            </div>
          )}
          <button
            type="button"
            onClick={removeFile}
            className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90 shadow-md"
          >
            <X className="w-3 h-3" />
          </button>

          {isCompressing && (
            <div className="absolute inset-0 bg-background/70 rounded-lg flex items-center justify-center">
              <div className="text-xs flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                Сжатие...
              </div>
            </div>
          )}
        </div>
      )}

      {/* Поле ввода */}
      <div className="flex gap-2 items-center">
        {/* Кнопка прикрепления */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setShowAttachMenu(!showAttachMenu)}
          disabled={isPending}
          className="flex-shrink-0"
        >
          {showAttachMenu ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </Button>

        <Input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Сообщение..."
          disabled={isPending}
          className="flex-1"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />

        <Button
          type="submit"
          size="icon"
          onClick={handleSubmit}
          disabled={isPending || (!text.trim() && !selectedFile)}
          className="flex-shrink-0"
        >
          {isPending ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;