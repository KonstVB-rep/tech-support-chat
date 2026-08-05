// src/entities/message/ui/MessageItem.tsx
"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { MessageCircleReply, X } from "lucide-react"
import Image from "next/image"
import { createPortal } from "react-dom"
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
import { useChatStore } from "@/store/useChatStore"

type ReplyToData = {
  id: string
  text: string | null
  senderName: string
  attachments: AttachmentMeta[]
}

type MessageProps = {
  id: string
  text: string | null
  sender: "user" | "support" | "admin"
  senderName: string
  timestamp: string
  attachments?: AttachmentMeta[]
  replyTo?: ReplyToData | null
}
const GRID_COLS = 3

function getGridSpan(index: number, total: number): string {
  if (index === 0) return "col-span-3 row-span-2"

  const lastRowCount = (total - 1) % GRID_COLS || GRID_COLS
  const firstIndexInLastRow = total - lastRowCount

  if (index < firstIndexInLastRow) return ""

  if (lastRowCount === 1) return "col-span-3 row-span-2"
  if (lastRowCount === 2) {
    return index === firstIndexInLastRow ? "col-span-2" : "col-span-1"
  }

  return ""
}

export const MessageItem = ({
  id,
  text,
  sender,
  senderName,
  timestamp,
  attachments = [],
  replyTo,
}: MessageProps) => {
  const isUser = sender === "user"
  const setReplyTo = useChatStore((s) => s.setReplyTo)

  const images = attachments.filter((a) => a.type.startsWith("image"))
  const videos = attachments.filter((a) => a.type.startsWith("video"))
  const docs = attachments.filter((a) => !a.type.startsWith("image") && !a.type.startsWith("video"))

  const mediaItems = [...images, ...videos]

  const [lightbox, setLightbox] = useState<{ index: number } | null>(null)

  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleReply = useCallback(() => {
    setReplyTo({
      id,
      text: text || null,
      senderName: isUser ? "Вы" : senderName,
      attachments,
    })
  }, [id, text, senderName, isUser, attachments, setReplyTo])

  const handlePointerDown = () => {
    longPressTimer.current = setTimeout(() => {
      handleReply()
      if (navigator.vibrate) navigator.vibrate(30)
    }, 500)
  }

  const handlePointerUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }

  const openLightbox = useCallback((index: number) => {
    setLightbox({ index })
  }, [])

  const closeLightbox = useCallback(() => {
    setLightbox(null)
  }, [])

  return (
    <>
      <div
        className={`mb-1 flex w-full min-w-20 ${isUser ? "justify-end" : "justify-start"}`}
        id={id}
      >
        <div
          className={`group relative flex min-w-[80px] max-w-[75%] select-text flex-col rounded-2xl p-0.5`}
          onPointerDown={handlePointerDown}
          onPointerLeave={handlePointerUp}
          onPointerUp={handlePointerUp}
        >
          {/* ✅ Блок цитаты */}
          {replyTo && <ReplyToBlock replyTo={replyTo} />}

          {/* Медиа-сетка */}
          {mediaItems.length > 0 && (
            <div className="mb-2 grid w-[400px] max-w-full auto-rows-[100px] grid-cols-3 gap-0.5 overflow-hidden rounded-xl">
              {mediaItems.map((item, i) => {
                const isVideo = item.type.startsWith("video")
                const spanClass = getGridSpan(i, mediaItems.length)

                return (
                  <button
                    className={cn(
                      "relative cursor-pointer overflow-hidden transition-opacity hover:opacity-90",
                      spanClass,
                    )}
                    key={i}
                    onClick={() => openLightbox(i)}
                    type="button"
                  >
                    {isVideo ? (
                      <>
                        <video
                          className="pointer-events-none h-full w-full object-cover"
                          preload="metadata"
                          src={item.url.replace(/\\/g, "/")}
                        >
                          <track default kind="captions" label="Без субтитров" srcLang="ru" />
                        </video>
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <span className="text-lg text-white">▶</span>
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

          {/* Текст + кнопка ответа */}
          {text ? (
            <div
              className={`relative flex w-fit flex-col items-end rounded-md bg-messege_outcoming ${
                isUser
                  ? "ml-auto rounded-br-none bg-message_outcoming text-white"
                  : "mr-auto rounded-bl-none border border-border/60 bg-message_incoming text-foreground"
              }`}
            >
              <div className="flex w-full justify-between gap-2 p-2">
                <p
                  className={cn(
                    "self-start whitespace-pre-wrap break-words text-sm leading-relaxed",
                  )}
                >
                  {text}
                </p>

                <span className="select-none content-end font-medium text-[10px] leading-none tracking-wide">
                  {timestamp}
                </span>
              </div>

              <Button
                className={cn(
                  "absolute bottom-0 shrink-0 rounded-full bg-blue-700 p-1 opacity-0 transition-colors hover:bg-blue-800 focus-visible:bg-blue-800 focus-visible:opacity-100 group-hover:opacity-100",
                  isUser ? "-left-10" : "-right-10",
                )}
                onClick={(e) => {
                  e.stopPropagation()
                  handleReply()
                }}
                size="icon"
                title="Ответить"
              >
                <MessageCircleReply className="h-3.5 w-3.5 text-white" />
              </Button>
            </div>
          ) : (
            <div className="s-full relative flex items-center justify-end">
              <span className="select-none rounded-xl bg-zinc-300 px-2 py-1 font-medium text-[10px] leading-none tracking-wide dark:bg-zinc-600">
                {timestamp}
              </span>

              <Button
                className={cn(
                  "absolute bottom-0 shrink-0 rounded-full bg-blue-700 p-1 opacity-0 transition-colors hover:bg-blue-800 focus-visible:bg-blue-800 focus-visible:opacity-100 group-hover:opacity-100",
                  isUser ? "-left-10" : "-right-10",
                )}
                onClick={(e) => {
                  e.stopPropagation()
                  handleReply()
                }}
                size="icon"
                title="Ответить"
              >
                <MessageCircleReply className="h-3.5 w-3.5 text-white" />
              </Button>
            </div>
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

const ReplyToBlock = ({ replyTo }: { replyTo: ReplyToData }) => {
  if (!replyTo) return null

  const hasText = !!replyTo.text
  const hasAttachments = replyTo.attachments.length > 0

  return (
    <a
      className="mb-1 cursor-pointer rounded-r border-primary/60 border-l-2 bg-muted px-3 py-2 transition-colors hover:bg-white/10"
      href={`#${replyTo.id}`}
    >
      <p className="truncate font-medium text-[10px] text-primary/80">{replyTo.senderName}</p>

      {hasText ? (
        <p className="truncate text-[10px] text-muted-foreground">{replyTo.text}</p>
      ) : hasAttachments ? (
        <div className="mt-0.5 flex items-center gap-1">
          <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded">
            {replyTo.attachments[0].type.startsWith("video") ? (
              <>
                <video
                  className="pointer-events-none h-full w-full object-cover"
                  preload="metadata"
                  src={replyTo.attachments[0].url.replace(/\\/g, "/")}
                >
                  <track default kind="captions" label="Без субтитров" srcLang="ru" />
                </video>
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <span className="text-[8px] text-white">▶</span>
                </div>
              </>
            ) : (
              <Image
                alt=""
                className="h-full w-full object-cover"
                fill
                sizes="32px"
                src={replyTo.attachments[0].url.replace(/\\/g, "/")}
              />
            )}
          </div>

          {replyTo.attachments.length > 1 && (
            <span className="text-[10px] text-muted-foreground">
              +{replyTo.attachments.length - 1}
            </span>
          )}
        </div>
      ) : (
        <p className="text-[10px] text-muted-foreground italic">Сообщение</p>
      )}
    </a>
  )
}

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
                  autoPlay
                  className="max-h-[85vh] max-w-full rounded-lg object-contain"
                  controls
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
        <Image
          alt={alt}
          className={cn(
            "h-full w-full object-cover transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0",
          )}
          fill
          onLoad={() => setIsLoaded(true)}
          sizes="100vw"
          src={normalizedSrc}
          unoptimized
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
          onLoad={() => setIsLoaded(true)}
          sizes="(max-width: 768px) 100vw, 300px"
          src={normalizedSrc}
          width={0}
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
            onLoad={() => setIsLoaded(true)}
            sizes="(max-width: 400px) 33vw, 130px"
            src={normalizedSrc}
          />
        </div>
      )}
    </>
  )
}
