export interface ImageConfig {
  width: number;
  height: number;
  quality: number;
}

export const DEFAULT_IMAGE_CONFIG: ImageConfig = {
  width: 128,
  height: 128,
  quality: 0.9,
};

export async function resizeImage(
  file: File,
  config: ImageConfig = DEFAULT_IMAGE_CONFIG
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = config.width;
        canvas.height = config.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        // Draw resized image
        ctx.drawImage(img, 0, 0, config.width, config.height);

        // Convert to base64
        const resizedBase64 = canvas.toDataURL("image/jpeg", config.quality);
        resolve(resizedBase64);
      };

      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  const validTypes = ["image/jpeg", "image/png", "image/jpg"];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!validTypes.includes(file.type)) {
    return { valid: false, error: "Please upload a JPEG or PNG image" };
  }

  if (file.size > maxSize) {
    return { valid: false, error: "Image size must be less than 10MB" };
  }

  return { valid: true };
}
