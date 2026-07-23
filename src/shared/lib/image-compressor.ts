// src/shared/lib/image-compressor.ts
function getMimeType(fileName: string, fallbackType?: string): string {
  if (fallbackType && fallbackType.includes("/")) return fallbackType;

  const ext = fileName.split(".").pop()?.toLowerCase();
  const mimeMap: Record<string, string> = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
    bmp: "image/bmp",
    ico: "image/x-icon",
    tiff: "image/tiff",
    tif: "image/tiff",
    avif: "image/avif",
  };

  return mimeMap[ext || ""] || "application/octet-stream";
}

export const compressImage = async (
  file: File,
  maxWidth = 1920,
  quality = 0.85,
): Promise<File> => {
  const normalizedType = getMimeType(file.name, file.type);

  // Файлы меньше 500KB не сжимаем, но возвращаем с корректным type
  if (file.size < 500 * 1024) {
    if (file.type === normalizedType) return file;
    return new File([file], file.name, { type: normalizedType });
  }

  return new Promise((resolve) => {
    const img = new window.Image();
    const reader = new FileReader();

    const isJpeg = normalizedType === "image/jpeg";
    const outputType = isJpeg ? "image/jpeg" : "image/webp";
    const ext = isJpeg ? "jpg" : "webp";

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(new File([file], file.name, { type: normalizedType }));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(new File([file], file.name, { type: normalizedType }));
            return;
          }

          const compressedFile = new File(
            [blob],
            file.name.replace(/\.[^.]+$/, `.${ext}`),
            { type: outputType },
          );

          console.log(
            `🗜️ Сжатие: ${(file.size / 1024).toFixed(0)}KB → ${(compressedFile.size / 1024).toFixed(0)}KB (${outputType})`,
          );

          resolve(compressedFile);
        },
        outputType,
        quality,
      );
    };

    img.onerror = () => {
      // При ошибке загрузки изображения возвращаем файл с нормализованным типом
      resolve(new File([file], file.name, { type: normalizedType }));
    };

    reader.readAsDataURL(file);
  });
};
