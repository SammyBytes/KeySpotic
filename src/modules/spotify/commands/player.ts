import { spotifyApi } from "../config/spotify";
/**
 * Toggles playback state: plays if paused, pauses if playing.
 * @returns void
 */
export const playOrPause = async () => {
  if (!isSpotifyInitialized()) return;

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
  await spotifyApi.skipToNext();
  console.log("[Spotify] Next track.");
};
/**
 * Skips to the previous track in the Spotify playback.
 * @returns void
 */
export const previousTrack = async () => {
  if (!isSpotifyInitialized()) return;
  await spotifyApi.skipToPrevious();
  console.log("[Spotify] Previous track.");
};

const isSpotifyInitialized = (): boolean => {
  if (!spotifyApi) {
    console.warn("[Spotify] Not initialized.");
    return false;
  }
  return true;
};
