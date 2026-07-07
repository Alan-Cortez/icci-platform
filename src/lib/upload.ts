import { put } from "@vercel/blob";

export async function uploadImage(file: File | string | null | undefined): Promise<string | null> {
  // If it's already a string URL (e.g. from an existing record), return it
  if (typeof file === "string" && file.startsWith("http")) {
    return file;
  }

  // If it's a valid File object
  if (file instanceof File && file.size > 0 && file.name !== "undefined") {
    const blob = await put(file.name, file, { access: 'public' });
    return blob.url;
  }

  return null;
}
