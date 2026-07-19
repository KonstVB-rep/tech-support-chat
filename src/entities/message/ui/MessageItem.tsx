// src/entities/message/ui/MessageItem.tsx
"use client";

import Image from "next/image";

interface MessageProps {
  text: string;
  sender: "user" | "support" | "admin";
  timestamp: string;
  fileUrl?: string | null;
  fileType?: string | null;
  fileName?: string | null;
}

export const MessageItem = ({
  text,
  sender,
  timestamp,
  fileUrl,
  fileType,
  fileName,
}: MessageProps) => {
  const isUser = sender === "user";

  return (
    <div
      className={`flex w-full mb-1 ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2 flex flex-col min-w-[80px] shadow-sm select-text ${
          isUser
            ? "bg-message_outcoming text-white rounded-br-none"
            : "bg-messege_incoming text-foreground rounded-bl-none border border-border/60"
        }`}
      >
        {fileUrl && fileType === "image" && (
          <div className="relative w-full max-w-[300px] rounded-lg overflow-hidden mb-2">
            <Image
              src={fileUrl}
              alt={fileName || "Изображение"}
              width={300}
              height={300}
              className="w-full h-auto object-contain cursor-pointer hover:opacity-90 transition-opacity"
              unoptimized
              onClick={() => window.open(fileUrl, "_blank")}
            />
          </div>
        )}

        {/* ✅ Видео */}
        {fileUrl && fileType === "video" && (
          <div className="relative w-full max-w-[300px] rounded-lg overflow-hidden mb-2">
            <video
              src={fileUrl}
              controls
              preload="metadata"
              className="w-full rounded-lg"
            >
              <track
                kind="captions"
                srcLang="ru"
                label="Без субтитров"
                default
              />
            </video>
          </div>
        )}

        {/* ✅ Файл (документ, архив) */}
        {fileUrl && fileType === "file" && (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-2 transition-colors ${
              isUser
                ? "bg-white/10 hover:bg-white/20 text-white"
                : "bg-background/50 hover:bg-background/80 text-foreground"
            }`}
          >
            <span className="text-lg">📎</span>
            <span className="text-sm truncate max-w-[200px]">
              {fileName || "Файл"}
            </span>
          </a>
        )}

        {/* Текст (может быть пустым если есть только медиа) */}
        {text && (
          <p className="text-sm break-words whitespace-pre-wrap leading-relaxed pr-2">
            {text}
          </p>
        )}

        <span
          className={`text-[9px] font-medium tracking-wide self-end mt-1 select-none leading-none ${
            isUser ? "text-blue-200/90" : "text-muted-foreground/80"
          }`}
        >
          {timestamp}
        </span>
      </div>
    </div>
  );
};
