// src/features/send-message/ui/MessageInput.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { useActiveTicketId } from "@/store/useChatStore";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { X, Send, Plus, Upload } from "lucide-react";
import { compressImage } from "@/shared/lib/image-compressor";
import AttachMenu from "@/features/send-message/ui/AttachMenu";
import { useUploadMutation } from "@/features/send-message";
import { useSendMessage } from "@/features/send-message";

type PendingFile = {
  id: string;
  file: File;
  preview: string | null;
  isCompressing: boolean;
};

export const MessageInput = ({
  overrideTicketId,
}: {
  overrideTicketId?: string | null;
}) => {
  const [text, setText] = useState("");
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [showAttachMenu, setShowAttachMenu] = useState(false);

  const globalTicketId = useActiveTicketId();
  const activeTicketId = overrideTicketId ?? globalTicketId;

  const { mutate: uploadMutate, isPending: isUploading } =
    useUploadMutation(activeTicketId);
  const { mutate: sendMessageMutate, isPending: isSending } =
    useSendMessage(activeTicketId);

  const isPending = isUploading || isSending;
  const hasFiles = pendingFiles.length > 0;

  const processFiles = async (fileList: FileList | File[]) => {
    const newFiles: PendingFile[] = [];

    for (const file of Array.from(fileList)) {
      const tempId = crypto.randomUUID();
      let processedFile = file;
      let preview: string | null = null;
      let isCompressing = false;

      if (file.type.startsWith("image/")) {
        isCompressing = true;
        try {
          processedFile = await compressImage(file);
        } catch {
          processedFile = file;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
          setPendingFiles((prev) =>
            prev.map((pf) =>
              pf.id === tempId
                ? {
                    ...pf,
                    preview: e.target?.result as string,
                    isCompressing: false,
                  }
                : pf,
            ),
          );
        };
        reader.readAsDataURL(processedFile);
      } else if (file.type.startsWith("video/")) {
        preview = URL.createObjectURL(file);
      }

      newFiles.push({
        id: tempId,
        file: processedFile,
        preview,
        isCompressing,
      });
    }

    setPendingFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setPendingFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target?.preview?.startsWith("blob:")) {
        URL.revokeObjectURL(target.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const clearAll = () => {
    setText("");
    setPendingFiles([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicketId) return;

    if (hasFiles) {
      uploadMutate(
        {
          chatId: activeTicketId,
          files: pendingFiles.map((pf) => pf.file),
          text: text.trim() || undefined,
        },
        { onSuccess: clearAll },
      );
    } else if (text.trim()) {
      sendMessageMutate(
        { chatId: activeTicketId, text: text.trim() },
        { onSuccess: () => setText("") },
      );
    }
  };

  if (!activeTicketId) return null;

  return (
    <div className="w-full max-w-2xl border-t border-border bg-background/50 backdrop-blur-xs mx-auto p-3 md:p-4 rounded-2xl">
      <AttachMenu
        isOpen={showAttachMenu}
        onClose={() => setShowAttachMenu(false)}
        onFileSelect={(file) => processFiles([file])}
      />

      {/* Сетка превью прикреплённых файлов */}
      {hasFiles && (
        <div className="mb-3 flex flex-wrap gap-2 max-h-[160px] overflow-y-auto no-scrollbar">
          {pendingFiles.map((pf) => (
            <div key={pf.id} className="relative group">
              {pf.preview && pf.file.type.startsWith("image/") ? (
                <div className="relative h-16 w-16 md:h-20 md:w-20 border border-border rounded-lg overflow-hidden">
                  <Image
                    src={pf.preview}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : pf.preview && pf.file.type.startsWith("video/") ? (
                <video
                  src={pf.preview}
                  className="h-16 w-16 md:h-20 md:w-20 object-cover rounded-lg border border-border"
                >
                  <track
                    kind="captions"
                    srcLang="ru"
                    label="Без субтитров"
                    default
                  />
                </video>
              ) : (
                <div className="h-16 w-16 md:h-20 md:w-20 flex flex-col items-center justify-center bg-muted rounded-lg border border-border px-1">
                  <span className="text-lg">📎</span>
                  <span className="text-[9px] truncate w-full text-center px-0.5">
                    {pf.file.name}
                  </span>
                </div>
              )}

              {pf.isCompressing && (
                <div className="absolute inset-0 bg-background/70 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              <button
                type="button"
                onClick={() => removeFile(pf.id)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center shadow-md z-10 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Форма отправки */}
      <form onSubmit={handleSubmit} className="flex gap-2 items-center">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setShowAttachMenu(!showAttachMenu)}
          disabled={isPending}
          className="shrink-0 rounded-xl"
        >
          {showAttachMenu ? (
            <X className="w-5 h-5" />
          ) : (
            <Plus className="w-5 h-5" />
          )}
        </Button>

        <Input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            hasFiles ? "Добавьте подпись..." : "Напишите сообщение..."
          }
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
          disabled={isPending || (!text.trim() && !hasFiles)}
          className="shrink-0 rounded-xl size-10 bg-blue-600 hover:bg-blue-700 text-white shadow-none border-0"
        >
          {isPending ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : hasFiles ? (
            <Upload className="w-4 h-4" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </form>
    </div>
  );
};

export default MessageInput;
