// src/features/send-message/ui/MessageInput.tsx
"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useActiveTicketId } from "@/store/useChatStore";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Paperclip, X, Send, Plus } from "lucide-react";
import AttachMenu from "./AttachMenu";
import { compressImage } from "@/shared/lib/image-compressor";
import { useUploadFile } from "../api/useUploadFile";
import Image from "next/image";


export const MessageInput = () => {
  const [text, setText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  
  const activeTicketId = useActiveTicketId();
  const queryClient = useQueryClient();
  const uploadMutation = useUploadFile();

  // Мутация отправки текстового сообщения
  const sendMessageMutation = useMutation({
    mutationFn: async (messageText: string) => {
      if (!activeTicketId) throw new Error("Нет активного чата");

      const res = await fetch(`/api/chats/${activeTicketId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: messageText }),
      });

      if (!res.ok) throw new Error("Ошибка сервера при отправке");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      
      setText("");
    },
  });

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);

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
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(file);
      } finally {
        setIsCompressing(false);
      }
    } else if (file.type.startsWith("video/")) {
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
            queryClient.invalidateQueries({ queryKey: ["chats"] });

            if (activeTicketId) {
              queryClient.invalidateQueries({ queryKey: ["messages", activeTicketId] });
            }
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
    <div className="w-full max-w-2xl border-t border-border bg-background mx-auto p-3 md:p-4 relative bottom-1 rounded-2xl">
      {/* Меню прикрепления документов */}
      <AttachMenu
        isOpen={showAttachMenu}
        onClose={() => setShowAttachMenu(false)}
        onFileSelect={handleFileSelect}
      />

      {/* Отрендеренное превью прикрепленного файла */}
      {selectedFile && (
        <div className="mb-3 relative inline-block">
             {preview && selectedFile.type.startsWith("image/") ? (
            <div className="relative h-32 w-48 md:h-48 md:w-72 border border-border rounded-lg overflow-hidden">
              {/* ✅ Используем next/image вместо <img> */}
              <Image
                src={preview}
                alt="Предпросмотр изображения для отправки"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          ) : preview && selectedFile.type.startsWith("video/") ? (
            <video
              src={preview}
              controls
              className="max-h-32 md:max-h-48 rounded-lg border border-border"
            >
              {/* ✅ Добавлен трек для субтитров по умолчанию */}
              <track kind="captions" srcLang="ru" label="Без субтитров" default />
            </video>
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
            className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90 shadow-md transition-transform active:scale-95"
          >
            <X className="w-3 h-3" />
          </button>

          {isCompressing && (
            <div className="absolute inset-0 bg-background/70 rounded-lg flex items-center justify-center">
              <div className="text-xs flex items-center gap-2 font-medium">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                Сжатие медиа...
              </div>
            </div>
          )}
        </div>
      )}

      {/* Форма отправки и поле ввода */}
      <form onSubmit={handleSubmit} className="flex gap-2 items-center">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setShowAttachMenu(!showAttachMenu)}
          disabled={isPending}
          className="flex-shrink-0 rounded-xl"
        >
          {showAttachMenu ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </Button>

        <Input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Напишите сообщение..."
          disabled={isPending}
          className="flex-1 rounded-xl h-10 border-muted-foreground/20 focus-visible:ring-primary"
          autoComplete="off"
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
          disabled={isPending || (!text.trim() && !selectedFile)}
          className="flex-shrink-0 rounded-xl size-10 bg-blue-600 hover:bg-blue-700 text-white shadow-none border-0"
        >
          {isPending ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </form>
    </div>
  );
};

export default MessageInput;
