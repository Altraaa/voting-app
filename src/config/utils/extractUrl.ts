export function extractPathFromUrl(url: string): string | null {
  if (!url) return null;

  try {
    if (!url.startsWith("http") && !url.startsWith("/")) {
      return decodeURIComponent(url);
    }

    const urlObj = new URL(url);

    if (!urlObj.hostname.includes("cloudinary.com")) return null;

    const afterUpload = urlObj.pathname.match(/\/image\/upload\/(.+)/);
    if (!afterUpload) return null;

    let segment = afterUpload[1]; // "q_auto/v1234/uploads/folder/image.webp"

    segment = segment
      .split("/")
      .filter((part) => !part.match(/^[a-z]+_/) && !part.match(/^v\d+$/))
      .join("/"); // → "uploads/folder/image.webp"

    // Hapus ekstensi file
    const withoutExt = segment.replace(/\.[^/.]+$/, ""); // → "uploads/folder/image"

    return withoutExt ? decodeURIComponent(withoutExt) : null;
  } catch {
    return null;
  }
}
