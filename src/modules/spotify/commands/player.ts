import { spotifyApi } from "../config/spotify";
/**
 * Toggles playback state: plays if paused, pauses if playing.
 * @returns void
 */
export const playOrPause = async () => {
  if (!isSpotifyInitialized()) return;
  if (!(await isDeviceActive())) {
    console.warn("[Spotify] No active device found.");
    return;
  }

  const playback = await spotifyApi.getMyCurrentPlaybackState();
  if (playback.body?.is_playing) {
    await spotifyApi.pause();
    console.log("[Spotify] Stopping...");
  } else {
    await spotifyApi.play();
    console.log("[Spotify] Playing...");
  }
};

/**
 * Skips to the next track in the Spotify playback.
 * @returns void
 */
export const nextTrack = async () => {
  if (!isSpotifyInitialized()) return;
  if (!(await isDeviceActive())) {
    console.warn("[Spotify] No active device found.");
    return;
  }
  await spotifyApi.skipToNext();
  console.log("[Spotify] Next track.");
};
/**
 * Skips to the previous track in the Spotify playback.
 * @returns void
 */
export const previousTrack = async () => {
  if (!isSpotifyInitialized()) return;
  if (!(await isDeviceActive())) {
    console.warn("[Spotify] No active device found.");
    return;
  }
  await spotifyApi.skipToPrevious();
  console.log("[Spotify] Previous track.");
};

const isSpotifyInitialized = (): boolean => {
  if (!spotifyApi) {
    console.warn("[Spotify] Not initialized.");
    return false;
  }

  console.log(
    "[Spotify] Initialized with access token:",
    spotifyApi.getAccessToken()
  );
  return true;
};

const isDeviceActive = async (): Promise<boolean> => {
  const devices = await spotifyApi.getMyDevices();
  return devices.body?.devices?.some((device) => device.is_active) ?? false;
};
