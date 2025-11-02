import notifier from "node-notifier";
import type { NotificationOptions } from "../models/notificationOptions";
import { tmpdir } from "os";

const imageCache = new Map<string, string>();
const MAX_CACHE_SIZE = 20;

/**
 * Sends a system notification using the provided options.
 * @param opts Notification options including title, message, iconPath, and sound.
 * @return void
 */
export const sendSystemNotification = (opts: NotificationOptions) => {
  notifier.notify(
    {
      title: opts.title,
      message: opts.message,
      icon: opts.iconPath,
      sound: opts.sound ?? false,
      timeout: 15,
    },
    (err, response, metadata) => {
      if (err) console.error("[Notifier] Error:", err);
      else console.log("[Notifier] Notification sent:", { response, metadata });
    }
  );
};

// To manage download tokens for image caching
let lastDownloadToken = 0;
/**
 * Downloads an image from the given URL to a temporary location.
 * Uses a token to manage concurrent downloads and avoid race conditions
 * with cached images.
 * @param url The URL of the image to download.
 * @param token A unique token representing the download request.
 * @returns The file path of the downloaded image, or undefined if the download failed or was superseded.
 */
export const downloadImageTemp = async (
  url: string,
  token: number
): Promise<string | undefined> => {
  if (!url) return undefined;

  lastDownloadToken = token;

  if (imageCache.has(url)) return imageCache.get(url)!;

  try {
    const path = `${tmpdir()}/spotify_album_art_${Date.now()}.jpg`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to download image");

    const arrayBuffer = await response.arrayBuffer();
    await Bun.file(path).write(new Uint8Array(arrayBuffer));

    // Ignore if the token is no longer the latest
    if (token !== lastDownloadToken) return undefined;

    imageCache.set(url, path);
    cleanupCache();
    return path;
  } catch (error) {
    console.error("[Notifier] Failed to download image:", error);
    return undefined;
  }
};
/**
 * Cleans up the image cache to ensure it does not exceed the maximum size.
 * @returns void
 */
export const cleanupCache = () => {
  while (imageCache.size > MAX_CACHE_SIZE) {
    const entry = imageCache.entries().next().value;
    if (!entry) return;
    const [oldUrl, oldPath] = entry;
    imageCache.delete(oldUrl);
    Bun.file(oldPath)
      .delete()
      .catch(() => {});
  }
};
