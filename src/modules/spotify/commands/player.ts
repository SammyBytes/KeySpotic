import { initSpotify } from "../config/spotifyConfig";

export async function playPause() {
  const spotifyApi = await initSpotify();
  if (!spotifyApi) return console.warn("[Spotify] Not initialized.");

  const playback = await spotifyApi.getMyCurrentPlaybackState();
  if (playback.body?.is_playing) {
    await spotifyApi.pause();
    console.log("[Spotify] Stopping...");
  } else {
    await spotifyApi.play();
    console.log("[Spotify] Playing...");
  }
}

export async function nextTrack() {
  const spotifyApi = await initSpotify();
  if (!spotifyApi) return;
  await spotifyApi.skipToNext();
  console.log("[Spotify] Next track.");
}

export async function previousTrack() {
  const spotifyApi = await initSpotify();
  if (!spotifyApi) return;
  await spotifyApi.skipToPrevious();
  console.log("[Spotify] Previous track.");
}
