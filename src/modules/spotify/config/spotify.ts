import SpotifyWebApi from "spotify-web-api-node";
import {
  retrieveTokens,
  updateAccessToken,
} from "../services/database/tokensServices";

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
/**
 * Initializes the Spotify API client by retrieving stored tokens
 * and refreshing them if necessary.
 * @returns {Promise<SpotifyWebApi | null>} The initialized Spotify API client or null if authorization is required.
 */
export const initSpotify = async (): Promise<SpotifyWebApi | null> => {
  const data = retrieveTokens();

  if (!data) {
    console.warn("[Spotify] No token found. Please authorize first.");
    return null;
  }

  const { accessToken, refreshToken, expiresIn } = data;

  if (isNotExpired(expiresIn)) {
    spotifyApi.setAccessToken(accessToken);
    return spotifyApi;
  }

  await refreshTokenIfNeeded(refreshToken, expiresIn);

  return spotifyApi;
};
/**
 * Refreshes the Spotify access token if it has expired.
 * @param refreshToken The refresh token to use for refreshing the access token.
 * @param expiresIn The expiration time of the current access token.
 * @returns void
 */
export const refreshTokenIfNeeded = async (
  refreshToken: string,
  expiresIn: number
) => {
  if (isNotExpired(expiresIn)) return;

  console.log("[Spotify] Token expired, refreshing...");

  spotifyApi.setRefreshToken(refreshToken);
  try {
    const data = await spotifyApi.refreshAccessToken();
    const newAccessToken = data.body.access_token;
    const newExpiresIn = data.body.expires_in;

    spotifyApi.setAccessToken(newAccessToken);
    updateAccessToken(newAccessToken, newExpiresIn);
    console.log("[Spotify] Token refreshed successfully.");
  } catch (err) {
    console.error("[Spotify] Error refreshing token:", err);
  }
};

export const isNotExpired = (expiresIn: number) => {
  return Date.now() < expiresIn;
};
