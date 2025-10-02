export function extractPathFromUrl(url: string): string | null {
  if (!url) return null;

  try {
    if (url.startsWith("/uploads/")) {
      return url.replace("/uploads/", "");
    }

    if (url.startsWith("http")) {
      const urlObj = new URL(url);
      const pathMatch = urlObj.pathname.match(/\/uploads\/(.+)/);
      return pathMatch ? decodeURIComponent(pathMatch[1]) : null;
    }

    if (url.includes("/") && !url.startsWith("/")) {
      return decodeURIComponent(url);
    }

    return null;
  } catch {
    if (url.startsWith("/uploads/")) {
      return url.replace("/uploads/", "");
    }
    return null;
  }
}
