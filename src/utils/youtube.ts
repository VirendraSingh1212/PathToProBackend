/**
 * Convert YouTube watch URLs to embed URLs
 * Handles both youtube.com/watch?v= and youtu.be/ formats
 */
export function convertToEmbed(url: string): string {
  if (!url) return "";

  // Already an embed URL
  if (url.includes("youtube.com/embed/")) {
    return url;
  }

  // Convert watch URL to embed
  if (url.includes("youtube.com/watch?v=")) {
    return url.replace("watch?v=", "embed/");
  }

  // Convert short URL to embed
  if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1].split("?")[0].split("&")[0];
    return `https://www.youtube.com/embed/${id}`;
  }

  // Return as-is if no pattern matches
  return url;
}
