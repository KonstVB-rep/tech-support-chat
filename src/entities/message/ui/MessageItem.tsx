// src/entities/message/ui/MessageItem.tsx
"use client"

import type { AttachmentMeta } from "@/entities/chat/api/types"
import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/components/button"
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/ui/components/carousel"
import { X } from "lucide-react"
import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
import { createPortal } from "react-dom"

type MessageProps = {
  text: string | null
  sender: "user" | "support" | "admin"
  timestamp: string
  attachments?: AttachmentMeta[]
}

const GRID_COLS = 3

function getGridSpan(index: number, total: number): string {
  // ✅ Первый элемент всегда на всю ширину
  if (index === 0) return "col-span-3 row-span-2"

  const lastRowCount = (total - 1) % GRID_COLS || GRID_COLS
  const firstIndexInLastRow = total - lastRowCount

  if (index < firstIndexInLastRow) return ""

  // Последний ряд неполный — растягиваем
  if (lastRowCount === 1) return "col-span-3 row-span-2"
  if (lastRowCount === 2) {
    return index === firstIndexInLastRow ? "col-span-2" : "col-span-1"
  }

  return ""
}

export const MessageItem = ({ text, sender, timestamp, attachments = [] }: MessageProps) => {
  const isUser = sender === "user"

  const images = attachments.filter((a) => a.type.startsWith("image"))
  const videos = attachments.filter((a) => a.type.startsWith("video"))
  const docs = attachments.filter(
    (a) => !a.type.startsWith("image") && !a.type.startsWith("video"),
  )

  // ✅ Единый массив медиа для сетки
  const mediaItems = [...images, ...videos]

  const [lightbox, setLightbox] = useState<{ index: number } | null>(null)

  const openLightbox = useCallback((index: number) => {
    setLightbox({ index })
  }, [])

  const closeLightbox = useCallback(() => {
    setLightbox(null)
  }, [])

  return (
    <>
      <div className={`mb-1 flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
        <div
          className={`flex min-w-[80px] max-w-[75%] select-text flex-col rounded-2xl p-0.5 shadow-sm`}
        >
          {/* ✅ Единая сетка для всех медиа */}
          {mediaItems.length > 0 && (
            <div className="mb-2 grid w-[400px] max-w-full auto-rows-[100px] grid-cols-3 gap-0.5 overflow-hidden rounded-xl">
              {mediaItems.map((item, i) => {
                const isVideo = item.type.startsWith("video")
                const spanClass = getGridSpan(i, mediaItems.length)

                return (
                  <button
                    type="button"
                    key={i}
                    className={cn(
                      "relative cursor-pointer overflow-hidden transition-opacity hover:opacity-90",
                      spanClass,
                    )}
                    onClick={() => openLightbox(i)}
                  >
                    {isVideo ? (
                      <>
                        <video
                          className="pointer-events-none h-full w-full object-cover"
                          preload="metadata"
                          src={item.url.replace(/\\/g, "/")}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <span className="text-white text-lg">▶</span>
                        </div>
                      </>
                    ) : (
                      <ImageWithPreview alt={item.name} singleImg={false} src={item.url} />
                    )}
                  </button>
                )
              })}
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
              href={doc.url.replace(/\\/g, "/")}
              key={`doc-${i}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="text-lg">📎</span>
              <span className="max-w-[200px] truncate text-sm">{doc.name}</span>
            </a>
          ))}

          {/* Текст */}
          {text ? (
            <div
              className={`flex flex-col w-fit items-end rounded-md bg-messege_outcoming ${
                isUser
                  ? "rounded-br-none bg-message_outcoming text-white ml-auto"
                  : "rounded-bl-none border border-border/60 bg-message_incoming text-foreground mr-auto"
              }`}
            >
              <p className="whitespace-pre-wrap break-words px-3 text-sm leading-relaxed">
                {text}
              </p>

              <span
                className={`mt-1 select-none self-end pr-2 pb-2 font-medium text-[9px] leading-none tracking-wide ${
                  isUser ? "text-blue-200/90" : "text-muted-foreground/80"
                }`}
              >
                {timestamp}
              </span>
            </div>
          ) : (
            <span
              className={`select-none self-end rounded-xl bg-zinc-600 px-2 py-1 font-medium text-[9px] leading-none tracking-wide ${
                isUser ? "text-blue-200/90" : "text-muted-foreground/80"
              }`}
            >
              {timestamp}
            </span>
          )}
        </div>
      </div>

      {/* Лайтбокс */}
      {lightbox !== null &&
        createPortal(
          <MediaLightbox
            initialIndex={lightbox.index}
            items={mediaItems}
            onClose={closeLightbox}
          />,
          document.body,
        )}
    </>
  )
}

// ✅ Лайтбокс определяет тип по элементу, а не по пропсу
function MediaLightbox({
  items,
  initialIndex,
  onClose,
}: {
  items: AttachmentMeta[]
  initialIndex: number
  onClose: () => void
}) {
  const [api, setApi] = useState<CarouselApi>()
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  useEffect(() => {
    if (api && initialIndex >= 0) {
      api.scrollTo(initialIndex)
    }
  }, [api, initialIndex])

  useEffect(() => {
    if (!api) return

    const onSelect = () => {
      setCurrentIndex(api.selectedScrollSnap())
    }

    api.on("select", onSelect)
    return () => {
      api.off("select", onSelect)
    }
  }, [api])

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
          {currentIndex + 1} / {items.length}
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
              {item.type.startsWith("video") ? (
                <video
                  className="max-h-[85vh] max-w-full rounded-lg object-contain"
                  controls
                  autoPlay
                  src={item.url.replace(/\\/g, "/")}
                >
                  <track default kind="captions" label="Без субтитров" srcLang="ru" />
                </video>
              ) : (
                <div className="relative h-[85vh] w-full max-w-full">
                  <Image
                    alt={item.name}
                    className="rounded-lg object-contain"
                    fill
                    priority={i === initialIndex}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    src={item.url.replace(/\\/g, "/")}
                  />
                </div>
              )}
            </CarouselItem>
          ))}
        </CarouselContent>

        {items.length > 1 && (
          <>
            <CarouselPrevious className="-left-4 hidden size-10 border-0 bg-white/10 text-white hover:bg-white/20 md:flex" />
            <CarouselNext className="-right-4 hidden size-10 border-0 bg-white/10 text-white hover:bg-white/20 md:flex" />
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
}: {
  src: string
  alt: string
  singleImg: boolean
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const normalizedSrc = src.replace(/\\/g, "/")

  const isBlobUrl = normalizedSrc.startsWith("blob:") || normalizedSrc.startsWith("data:")

  if (isBlobUrl) {
    return (
      <div className="absolute inset-0">
        {!isLoaded && <div className="absolute inset-0 animate-pulse bg-muted/30" />}
            // biome-ignore lint/a11y/useAltText: preview-only image, alt provided by parent context
            // biome-ignore lint/security/noDangerouslySetInnerHtml: not used here
            {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt={alt}
          className={cn(
            "h-full w-full object-cover transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0",
          )}
          onLoad={() => setIsLoaded(true)}
          src={normalizedSrc}
        />
      </div>
    )
  }

  return (
    <>
      {!isLoaded && (
        <div
          className={cn(
            "absolute inset-0 animate-pulse bg-muted/30",
            !singleImg && "aspect-square",
          )}
        />
      )}

      {singleImg ? (
        <Image
          alt={alt}
          className={cn(
            "h-auto w-full object-contain transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0",
          )}
          height={0}
          sizes="(max-width: 768px) 100vw, 300px"
          src={normalizedSrc}
          unoptimized
          width={0}
          onLoad={() => setIsLoaded(true)}
        />
      ) : (
        <div className="absolute inset-0">
          <Image
            alt={alt}
            className={cn(
              "object-cover transition-opacity duration-300",
              isLoaded ? "opacity-100" : "opacity-0",
            )}
            fill
            sizes="(max-width: 400px) 33vw, 130px"
            src={normalizedSrc}
            onLoad={() => setIsLoaded(true)}
          />
        </div>
      )}
    </>
  )
}