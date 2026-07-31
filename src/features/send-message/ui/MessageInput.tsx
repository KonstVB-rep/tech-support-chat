// src/features/send-message/ui/MessageInput.tsx
"use client"

import { useState } from "react"
import { Plus, Send, Upload, X } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import { useSendMessage, useUploadMutation } from "@/features/send-message"
import AttachMenu from "@/features/send-message/ui/AttachMenu"
import { compressImage } from "@/shared/lib/image-compressor"
import { Button } from "@/shared/ui/components/button"
import { Input } from "@/shared/ui/components/input"
import { useActiveTicketId } from "@/store/useChatStore"

type PendingFile = {
  id: string
  file: File
  preview: string | null
  isCompressing: boolean
}

const MAX_FILE_SIZE = 50 * 1024 * 1024

export const MessageInput = ({ overrideTicketId }: { overrideTicketId?: string | null }) => {
  const [text, setText] = useState("")
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([])
  const [showAttachMenu, setShowAttachMenu] = useState(false)

  const globalTicketId = useActiveTicketId()
  const activeTicketId = overrideTicketId ?? globalTicketId

  const { mutate: uploadMutate, isPending: isUploading } = useUploadMutation(activeTicketId)
  const { mutate: sendMessageMutate, isPending: isSending } = useSendMessage(activeTicketId)

  const isPending = isUploading || isSending
  const hasFiles = pendingFiles.length > 0

const processFiles = async (fileList: FileList | File[]) => {
  const files = Array.from(fileList).filter((f): f is File => f instanceof File)

  for (const file of files) {
    if (file.size > MAX_FILE_SIZE) {
      toast.error(
        `Файл "${file.name}" слишком большой (${(file.size / 1024 / 1024).toFixed(1)}MB). Максимум ${MAX_FILE_SIZE / 1024 / 1024}MB.`,
      )
      continue
    }

    const tempId = crypto.randomUUID()

    // ✅ Сначала добавляем в state с isCompressing=true
    setPendingFiles((prev) => [
      ...prev,
      { id: tempId, file, preview: null, isCompressing: true },
    ])

    try {
      let processedFile = file
      let preview: string | null = null

      if (file.type.startsWith("image/")) {
        // ✅ Компрессия И чтение — последовательно
        try {
          processedFile = await compressImage(file)
        } catch {
          processedFile = file
        }

        preview = await new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = () => resolve("")
          reader.readAsDataURL(processedFile)
        })
      } else if (file.type.startsWith("video/")) {
        preview = URL.createObjectURL(file)
      }

      // ✅ Обновляем только когда ВСЁ готово
      setPendingFiles((prev) =>
        prev.map((pf) =>
          pf.id === tempId
            ? { ...pf, file: processedFile, preview, isCompressing: false }
            : pf,
        ),
      )
    } catch {
      setPendingFiles((prev) =>
        prev.map((pf) =>
          pf.id === tempId ? { ...pf, isCompressing: false } : pf,
        ),
      )
    }
  }
}

  const removeFile = (id: string) => {
    setPendingFiles((prev) => {
      const target = prev.find((f) => f.id === id)
      if (target?.preview?.startsWith("blob:")) {
        URL.revokeObjectURL(target.preview)
      }
      return prev.filter((f) => f.id !== id)
    })
  }

  const clearAll = () => {
    setText("")
    setPendingFiles([])
  }

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (!activeTicketId) return

    if (hasFiles) {
      uploadMutate(
        {
          files: pendingFiles.map((pf) => pf.file),
          text: text.trim() || undefined,
        },
        { onSuccess: clearAll },
      )
    } else if (text.trim()) {
      sendMessageMutate(
        { chatId: activeTicketId, text: text.trim() },
        { onSuccess: () => setText("") },
      )
    }
  }
  if (!activeTicketId) return null

  return (
    <div className="mx-auto w-full max-w-2xl rounded-2xl border-border border-t bg-background/50 backdrop-blur-xs">
      <AttachMenu
        isOpen={showAttachMenu}
        onClose={() => setShowAttachMenu(false)}
        onFileSelect={(files) => processFiles(files)}
      />

      {/* Сетка превью прикреплённых файлов */}
      {hasFiles && (
        <div className="no-scrollbar flex max-h-[160px] flex-wrap gap-2 overflow-y-auto px-2 pt-2">
          {pendingFiles.map((pf) => (
            <div className="group relative" key={pf.id}>
              {pf.preview && pf.file.type.startsWith("image/") ? (
                <div className="relative overflow-hidden rounded-lg border border-border h-12 w-12">
                  <Image alt="" className="object-cover" fill src={pf.preview} unoptimized />
                </div>
              ) : pf.preview && pf.file.type.startsWith("video/") ? (
                <video
                  className="h-12 w-12 rounded-lg border border-border object-cover"
                  src={pf.preview}
                >
                  <track default kind="captions" label="Без субтитров" srcLang="ru" />
                </video>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-muted px-1 h-12 w-12">
                  <span className="text-lg">📎</span>
                  <span className="w-full truncate px-0.5 text-center text-[9px]">
                    {pf.file.name}
                  </span>
                </div>
              )}

              {pf.isCompressing && (
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/70">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              )}

              <button
                className="-top-1.5 -right-1.5 absolute z-10 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100"
                onClick={() => removeFile(pf.id)}
                type="button"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Форма отправки */}
      <form className="flex items-center gap-2 p-2" onSubmit={handleSubmit}>
        <Button
          className="shrink-0 rounded-xl"
          disabled={isPending}
          onClick={() => setShowAttachMenu(!showAttachMenu)}
          size="icon"
          type="button"
          variant="ghost"
        >
          {showAttachMenu ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
        </Button>

        <Input
          autoComplete="off"
          className="h-10 flex-1 rounded-xl border-muted-foreground/20 focus-visible:ring-primary"
          disabled={isPending}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSubmit(e)
            }
          }}
          placeholder={hasFiles ? "Добавьте подпись..." : "Напишите сообщение..."}
          type="text"
          value={text}
        />

        <Button
          className="size-10 shrink-0 rounded-xl border-0 bg-blue-600 text-white shadow-none hover:bg-blue-700"
          disabled={isPending || (!text.trim() && !hasFiles)}
          size="icon"
          type="submit"
        >
          {isPending ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : hasFiles ? (
            <Upload className="h-4 w-4" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  )
}
