// src/entities/message/ui/MessageItem.tsx
"use client";

import type { AttachmentMeta } from "@/entities/chat/api/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/shared/ui/carousel";
import { X } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../../shared/lib/utils";

type MessageProps = {
  text: string | null;
  sender: "user" | "support" | "admin";
  timestamp: string;
  attachments?: AttachmentMeta[];
};

export const MessageItem = ({
  text,
  sender,
  timestamp,
  attachments = [],
}: MessageProps) => {
  const isUser = sender === "user";

  const images = attachments.filter((a) => a.type.startsWith("image"));
  const videos = attachments.filter((a) => a.type.startsWith("video"));
  const docs = attachments.filter(
    (a) => !a.type.startsWith("image") && !a.type.startsWith("video"),
  );

  const [lightbox, setLightbox] = useState<{
    type: "image" | "video";
    index: number;
  } | null>(null);

  const openLightbox = useCallback((type: "image" | "video", index: number) => {
    setLightbox({ type, index });
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox(null);
  }, []);

  return (
    <>
      <div
        className={`flex w-full mb-1 ${isUser ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`max-w-[75%] rounded-2xl p-0.5 flex flex-col min-w-[80px] shadow-sm select-text ${
            isUser
              ? "bg-message_outcoming text-white rounded-br-none"
              : "bg-messege_incoming text-foreground rounded-bl-none border border-border/60"
          }`}
        >
          {/* Изображения */}
          {images.length > 0 && (
            <div className="mb-2">
              {images.length === 1 ? (
                <div
                  className="relative w-full max-w-[300px] rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => openLightbox("image", 0)}
                >
                  {/* <img
                    src={images[0].url}
                    alt={images[0].name}
                    className="w-full h-auto object-contain"
                  /> */}
                  <ImageWithPreview
                    src={images[0].url}
                    alt={images[0].name}
                    singleImg={true}
                    className="w-full h-auto object-contain"
                  />
                </div>
              ) : (
                <div
                  className={`grid gap-1 rounded-lg overflow-hidden ${
                    images.length <= 4 ? "grid-cols-2" : "grid-cols-3"
                  }`}
                >
                  {images.map((img, i) => (
                    <div
                      key={i}
                      className="relative aspect-square overflow-hidden cursor-pointer hover:opacity-90 transition-opacity min-w-40"
                      onClick={() => openLightbox("image", i)}
                    >
                      <ImageWithPreview
                        src={img.url}
                        alt={img.name}
                        singleImg={false}
                        className="w-full h-auto object-contain"
                      />
                      {/* <Image
                        src={img.url}
                        alt={img.name}
                        fill
                        className="object-cover"
                        unoptimized
                      /> */}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Видео */}
          {videos.length > 0 && (
            <div className="mb-2">
              {videos.length === 1 ? (
                <div
                  className="relative w-full max-w-[300px] rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => openLightbox("video", 0)}
                >
                  <video
                    src={videos[0].url}
                    preload="metadata"
                    className="w-full rounded-lg pointer-events-none"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <span className="text-white text-2xl">▶</span>
                  </div>
                </div>
              ) : (
                <div
                  className={`grid gap-1 rounded-lg overflow-hidden ${
                    videos.length <= 4 ? "grid-cols-2" : "grid-cols-3"
                  }`}
                >
                  {videos.map((vid, i) => (
                    <div
                      key={i}
                      className="relative aspect-square overflow-hidden cursor-pointer hover:opacity-90 transition-opacity min-w-40"
                      onClick={() => openLightbox("video", i)}
                    >
                      <VideoWithPreview
                        src={vid.url}
                        className="w-full h-full object-cover pointer-events-none"
                      />
                      {/* <video
                        src={vid.url}
                        preload="metadata"
                        className="w-full h-full object-cover pointer-events-none"
                      /> */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <span className="text-white text-xl">▶</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Документы */}
          {docs.map((doc, i) => (
            <a
              key={`doc-${i}`}
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-1 transition-colors ${
                isUser
                  ? "bg-white/10 hover:bg-white/20 text-white"
                  : "bg-background/50 hover:bg-background/80 text-foreground"
              }`}
            >
              <span className="text-lg">📎</span>
              <span className="text-sm truncate max-w-[200px]">{doc.name}</span>
            </a>
          ))}

          {/* Текст */}
          {text && (
            <p className="text-sm break-words whitespace-pre-wrap leading-relaxed px-3 py-2">
              {text}
            </p>
          )}

          <span
            className={`text-[9px] font-medium tracking-wide self-end mt-1 select-none pb-2 pr-2 leading-none ${
              isUser ? "text-blue-200/90" : "text-muted-foreground/80"
            }`}
          >
            {timestamp}
          </span>
        </div>
      </div>

      {/* ✅ Лайтбокс рендерится только при открытии через Portal */}
      {lightbox &&
        createPortal(
          <MediaLightbox
            type={lightbox.type}
            items={lightbox.type === "image" ? images : videos}
            initialIndex={lightbox.index}
            onClose={closeLightbox}
          />,
          document.body,
        )}
    </>
  );
};

// ✅ Отдельный компонент лайтбокса — не засоряет MessageItem
type MediaLightboxProps = {
  type: "image" | "video";
  items: AttachmentMeta[];
  initialIndex: number;
  onClose: () => void;
};

function MediaLightbox({
  type,
  items,
  initialIndex,
  onClose,
}: MediaLightboxProps) {
  const [api, setApi] = useState<CarouselApi>();

  useState(() => {
    if (!api) return;
    api.scrollTo(initialIndex);
  });

  useState(() => {
    if (api && initialIndex >= 0) {
      api.scrollTo(initialIndex);
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      {items.length > 1 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 text-white/80 text-sm font-medium">
          {initialIndex + 1} / {items.length}
        </div>
      )}

      <Carousel
        className="w-full max-w-5xl px-4"
        opts={{ startIndex: initialIndex, loop: items.length > 1 }}
        setApi={setApi}
      >
        <CarouselContent>
          {items.map((item, i) => (
            <CarouselItem key={i} className="flex items-center justify-center">
              {type === "image" ? (
                <img
                  src={item.url}
                  alt={item.name}
                  className="max-h-[85vh] max-w-full object-contain rounded-lg"
                />
              ) : (
                <video
                  src={item.url}
                  controls
                  autoPlay
                  className="max-h-[85vh] max-w-full rounded-lg"
                >
                  <track
                    kind="captions"
                    srcLang="ru"
                    label="Без субтитров"
                    default
                  />
                </video>
              )}
            </CarouselItem>
          ))}
        </CarouselContent>

        {items.length > 1 && (
          <>
            <CarouselPrevious className="-left-4 bg-white/10 hover:bg-white/20 border-0 text-white size-10 hidden md:block" />
            <CarouselNext className="-right-4 bg-white/10 hover:bg-white/20 border-0 text-white size-10 hidden md:block" />
          </>
        )}
      </Carousel>
    </div>
  );
}

const ImageWithPreview = ({
  src,
  alt,
  singleImg,
  className,
}: {
  src: string;
  alt: string;
  singleImg: boolean;
  className?: string;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      {!isLoaded && (
        <div
          className={cn(
            "bg-muted/30 animate-pulse rounded-lg",
            singleImg
              ? "w-full max-w-[300px] aspect-auto min-h-[200px]"
              : "aspect-square min-w-40",
          )}
        />
      )}

      {singleImg ? (
        <img
          src={src}
          alt={alt}
          className={`w-full h-auto object-contain transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0 absolute inset-0"
          } ${className}`}
          onLoad={() => setIsLoaded(true)}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          unoptimized
          className={`object-cover transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          } ${className}`}
          onLoad={() => setIsLoaded(true)}
        />
      )}
    </>
  );
};

const VideoWithPreview = ({
  src,
  className,
}: {
  src: string;
  className?: string;
}) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  return (
    <div className="relative">
      {!isVideoLoaded && (
        <div className="absolute inset-0 bg-muted/30 animate-pulse rounded-lg" />
      )}
      <video
        src={src}
        preload="metadata"
        className={`w-full rounded-lg transition-opacity duration-300 ${className} ${
          isVideoLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoadedData={() => setIsVideoLoaded(true)}
      >
        <track kind="captions" srcLang="ru" label="Без субтитров" default />
      </video>
    </div>
  );
};
