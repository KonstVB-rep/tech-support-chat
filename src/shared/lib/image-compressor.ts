// src/shared/lib/image-compressor.ts
export const compressImage = async (
  file: File,
  maxWidth = 1920,
  quality = 0.85,
): Promise<File> => {
  if (file.size < 500 * 1024) return file;

  return new Promise((resolve) => {
    const img = new window.Image();
    const reader = new FileReader();

    // ✅ Определяем формат ЗАРАНЕЕ
    const isJpeg = file.type === "image/jpeg" || file.type === "image/jpg";
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
        resolve(file);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }

          const compressedFile = new File(
            [blob],
            file.name.replace(/\.[^.]+$/, `.${ext}`),
            { type: outputType },
          );

          console.log(
            `🗜️ Сжатие: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`,
          );

          resolve(compressedFile);
        },
        outputType,
        quality,
      );
    };

    reader.readAsDataURL(file);
  });
};
