export function isValidYouTubeUrl(url: string): boolean {
  if (!url) return false;
  // Pola sederhana untuk mendeteksi domain YouTube
  const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//;
  return pattern.test(url);
}
