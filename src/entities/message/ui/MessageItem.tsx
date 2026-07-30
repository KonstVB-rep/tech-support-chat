// src/entities/message/ui/MessageItem.tsx
"use client"

import { useCallback, useState } from "react"
import { X } from "lucide-react"
import Image from "next/image"
import { createPortal } from "react-dom"
import type { AttachmentMeta } from "@/entities/chat/api/types"
import { Button } from "@/shared/ui/components/button"
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/ui/components/carousel"
import { cn } from "../../../shared/lib/utils"

type MessageProps = {
  text: string | null
  sender: "user" | "support" | "admin"
  timestamp: string
  attachments?: AttachmentMeta[]
}

export const MessageItem = ({ text, sender, timestamp, attachments = [] }: MessageProps) => {
  const isUser = sender === "user"

  const images = attachments.filter((a) => a.type.startsWith("image"))
  const videos = attachments.filter((a) => a.type.startsWith("video"))
  const docs = attachments.filter((a) => !a.type.startsWith("image") && !a.type.startsWith("video"))

  const [lightbox, setLightbox] = useState<{
    type: "image" | "video"
    index: number
  } | null>(null)

  const openLightbox = useCallback((type: "image" | "video", index: number) => {
    setLightbox({ type, index })
  }, [])

  const closeLightbox = useCallback(() => {
    setLightbox(null)
  }, [])

  return (
    <>
      <div className={`mb-1 flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
        <div
          className={`flex min-w-[80px] max-w-[75%] select-text flex-col rounded-2xl p-0.5 shadow-sm ${
            isUser
              ? "rounded-br-none bg-message_outcoming text-white"
              : "rounded-bl-none border border-border/60 bg-messege_incoming text-foreground"
          }`}
        >
          {/* Изображения */}
          {images.length > 0 && (
            <div className="mb-2">
              {images.length === 1 ? (
                <Button
                  className="relative block aspect-square h-auto w-full min-w-40 cursor-pointer overflow-hidden rounded-xl border-none p-0 transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary"
                  onClick={() => openLightbox("image", 0)}
                  variant="ghost"
                >
                  <ImageWithPreview
                    alt={images[0].name}
                    className="h-auto w-full object-contain"
                    singleImg={true}
                    src={images[0].url}
                  />
                </Button>
              ) : (
                <div
                  className={`grid gap-1 overflow-hidden rounded-lg ${
                    images.length <= 4 ? "grid-cols-2" : "grid-cols-3"
                  }`}
                >
                  {images.map((img, i) => (
                    <Button
                      className="relative block aspect-square h-auto w-full min-w-40 cursor-pointer overflow-hidden rounded-xl border-none p-0 transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary"
                      key={i}
                      onClick={() => openLightbox("image", i)}
                      variant="ghost"
                    >
                      <ImageWithPreview
                        alt={img.name}
                        className="h-auto w-full object-contain"
                        singleImg={false}
                        src={img.url}
                      />
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Видео */}
          {videos.length > 0 && (
            <div className="mb-2">
              {videos.length === 1 ? (
                <Button
                  className="relative w-full max-w-[300px] cursor-pointer overflow-hidden rounded-lg transition-opacity hover:opacity-90"
                  onClick={() => openLightbox("video", 0)}
                  variant="ghost"
                >
                  <VideoWithPreview
                    className="pointer-events-none h-full w-full object-cover"
                    src={videos[0].url}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <span className="text-2xl text-white">▶</span>
                  </div>
                </Button>
              ) : (
                <div
                  className={`grid gap-1 overflow-hidden rounded-lg ${
                    videos.length <= 4 ? "grid-cols-2" : "grid-cols-3"
                  }`}
                >
                  {videos.map((vid, i) => (
                    <Button
                      className="relative block aspect-square h-auto w-full min-w-40 cursor-pointer overflow-hidden rounded-xl border-none p-0 transition-opacity hover:opacity-90"
                      key={i}
                      onClick={() => openLightbox("video", i)}
                      type="button"
                      variant="ghost"
                    >
                      <VideoWithPreview
                        className="pointer-events-none h-full w-full object-cover"
                        src={vid.url}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <span className="sr-only">Воспроизвести видео</span>
                        <span aria-hidden="true" className="text-white text-xl">
                          ▶
                        </span>
                      </div>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Документы */}
          {docs.map((doc, i) => (
            <a
              className={`mb-1 flex items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
                isUser
                  ? "bg-white/10 text-white hover:bg-white/20"
                  : "bg-background/50 text-foreground hover:bg-background/80"
              }`}
              href={doc.url}
              key={`doc-${i}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="text-lg">📎</span>
              <span className="max-w-[200px] truncate text-sm">{doc.name}</span>
            </a>
          ))}

          {/* Текст */}
          {text && (
            <p className="whitespace-pre-wrap break-words px-3 py-2 text-sm leading-relaxed">
              {text}
            </p>
          )}

          <span
            className={`mt-1 select-none self-end pr-2 pb-2 font-medium text-[9px] leading-none tracking-wide ${
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
            initialIndex={lightbox.index}
            items={lightbox.type === "image" ? images : videos}
            onClose={closeLightbox}
            type={lightbox.type}
          />,
          document.body,
        )}
    </>
  )
}

type MediaLightboxProps = {
  type: "image" | "video"
  items: AttachmentMeta[]
  initialIndex: number
  onClose: () => void
}

function MediaLightbox({ type, items, initialIndex, onClose }: MediaLightboxProps) {
  const [api, setApi] = useState<CarouselApi>()

  useState(() => {
    if (!api) return
    api.scrollTo(initialIndex)
  })

  useState(() => {
    if (api && initialIndex >= 0) {
      api.scrollTo(initialIndex)
    }
  })

  return (
    <div className="fade-in fixed inset-0 z-50 flex animate-in items-center justify-center bg-black/90 backdrop-blur-sm duration-200">
      <Button
        className="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
        onClick={onClose}
        size="icon"
        variant="ghost"
      >
        <X className="h-6 w-6" />
      </Button>

      {items.length > 1 && (
        <div className="-translate-x-1/2 absolute top-4 left-1/2 z-10 font-medium text-sm text-white/80">
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
            <CarouselItem className="flex items-center justify-center" key={i}>
              {type === "image" ? (
                <div className="relative h-[85vh] w-full max-w-full">
                  <Image
                    alt={item.name}
                    className="rounded-lg object-contain"
                    fill
                    priority={i === 0}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    src={item.url}
                  />
                </div>
              ) : (
                <video
                  className="max-h-[85vh] max-w-full rounded-lg object-contain"
                  controls
                  src={item.url}
                >
                  <track default kind="captions" label="Без субтитров" srcLang="ru" />
                </video>
              )}
            </CarouselItem>
          ))}
        </CarouselContent>

        {items.length > 1 && (
          <>
            <CarouselPrevious className="-left-4 hidden size-10 border-0 bg-white/10 text-white hover:bg-white/20 md:block" />
            <CarouselNext className="-right-4 hidden size-10 border-0 bg-white/10 text-white hover:bg-white/20 md:block" />
          </>
        )}
      </Carousel>
    </div>
  )
}

const ImageWithPreview = ({
  src,
  alt,
  singleImg,
  className,
}: {
  src: string
  alt: string
  singleImg: boolean
  className?: string
}) => {
  const [isLoaded, _setIsLoaded] = useState(false)

  return (
    <>
      {!isLoaded && (
        <div
          className={cn(
            "animate-pulse rounded-lg bg-muted/30",
            singleImg ? "aspect-auto min-h-[200px] w-full max-w-[300px]" : "aspect-square min-w-40",
          )}
        />
      )}

      {singleImg ? (
        <div className="relative aspect-square w-full min-w-40 max-w-sm">
          <Image
            alt={alt}
            className={className}
            fill
            sizes="(max-width: 768px) 100vw, 384px"
            src={src}
          />
        </div>
      ) : (
        <Image alt={alt} className={className} height={160} src={src} width={160} />
      )}
    </>
  )
}

const VideoWithPreview = ({ src, className }: { src: string; className?: string }) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  return (
    <div className="relative">
      {!isVideoLoaded && <div className="absolute inset-0 animate-pulse rounded-lg bg-muted/30" />}
      <video
        className={`w-full rounded-lg transition-opacity duration-300 ${className} ${
          isVideoLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoadedData={() => setIsVideoLoaded(true)}
        preload="metadata"
        src={src}
      >
        <track default kind="captions" label="Без субтитров" srcLang="ru" />
      </video>
    </div>
  )
}
