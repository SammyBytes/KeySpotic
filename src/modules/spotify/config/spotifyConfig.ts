import SpotifyWebApi from "spotify-web-api-node";
import { getToken, updateAccessToken } from "./spotifyDB";

export const spotifyApi = new SpotifyWebApi({
  clientId: Bun.env.SPOTIFY_CLIENT_ID!,
  clientSecret: Bun.env.SPOTIFY_CLIENT_SECRET!,
  redirectUri: Bun.env.SPOTIFY_REDIRECT_URI!,
});

export const scopes = [
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "playlist-read-private",
];

export async function initSpotify() {
  const tokenData = getToken();

  if (!tokenData) {
    console.warn("[Spotify] No token found. Please authorize first.");
    return null;
  }

  const { access_token, refresh_token, expires_at } = tokenData;

  if (Date.now() < expires_at) {
    spotifyApi.setAccessToken(access_token);
    return spotifyApi;
  }

  console.log("[Spotify] Token expired, refreshing...");

  spotifyApi.setRefreshToken(refresh_token);
  try {
    const data = await spotifyApi.refreshAccessToken();
    const newAccessToken = data.body.access_token;
    const newExpiresIn = data.body.expires_in;

    spotifyApi.setAccessToken(newAccessToken);
    updateAccessToken(newAccessToken, newExpiresIn);
    console.log("[Spotify] Token refreshed successfully.");
  } catch (err) {
    console.error("[Spotify] Error refreshing token:", err);
    return null;
  }

  return spotifyApi;
}
