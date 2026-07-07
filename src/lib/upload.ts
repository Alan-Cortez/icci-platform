import { put } from "@vercel/blob";

export async function uploadImage(file: File | string | null | undefined): Promise<string | null> {
  // If it's already a string URL (e.g. from an existing record), return it
  if (typeof file === "string" && file.startsWith("http")) {
    return file;
  }

  // If it's a valid File object with actual content
  if (file instanceof File && file.size > 0 && file.name && file.name !== "undefined") {
    try {
      const blob = await put(file.name, file, { access: 'public' });
      return blob.url;
    } catch (error) {
      console.error("Vercel Blob Upload Error:", error);
      throw new Error("Failed to upload image. Please check your Vercel Blob configuration.");
    }
  }

  return null;
}
