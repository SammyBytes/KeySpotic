import { spotifyAuthRoutes } from "./routes/main";
import { retrieveCertPaths } from "../auth/certHelper";
import {
  retrieveTokens,
  tokenExists,
} from "./services/database/tokensServices";
import {
  isNotExpired,
  refreshTokenIfNeeded,
  scopes,
  spotifyApi,
} from "./config/spotify";
/**
 * Initializes Spotify authentication by retrieving existing tokens
 * and setting up the HTTPS server for OAuth callbacks.
 *
 */
export const initSpotifyAuth = () => {
  if (!setupSpotifyToken()) 
    serveSpotify();
};

const setupSpotifyToken = (): boolean => {
  if (!tokenExists()) {
    return promptAuthorization();
  }

  const tokens = retrieveTokens()!;
  if (isNotExpired(tokens.expiresIn)) {
    console.log("[Spotify] Token valid. Using existing token.");
    spotifyApi.setAccessToken(tokens.accessToken);
    return true;
  }

  console.log("[Spotify] Token expired. Refreshing...");
  refreshTokenIfNeeded(tokens.refreshToken, tokens.expiresIn);
  const updatedTokens = retrieveTokens()!;
  spotifyApi.setAccessToken(updatedTokens.accessToken);
  return true;
};

/**
 * Prompts the user to authorize the application with Spotify by displaying
 * @returns {boolean} False indicating authorization is required.
 */
const promptAuthorization = (): boolean => {
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes, "state-spotify");
  console.log("\n Open this link to authorize Spotify:");
  console.log(authorizeURL);
  return false;
};
/**
 * Sets up and starts the HTTPS server to handle Spotify OAuth callbacks.
 */
const serveSpotify = () => {
  Bun.serve({
    port: Number(Bun.env.HONO_PORT) || 54321,
    fetch: spotifyAuthRoutes.fetch,
    tls: {
      certFile: retrieveCertPaths.certFile,
      keyFile: retrieveCertPaths.keyFile,
    },
  });

  console.log(
    `Server HTTPS listening on https://localhost:${Bun.env.HONO_PORT}`
  );
};
