import { spotifyAuthRoutes } from "./routes/main";
import { scopes, spotifyApi } from "./config/spotifyConfig";
import { getToken } from "./config/spotifyDB";
import { retrieveCertPaths } from "../auth/certHelper";
/**
 * Initializes Spotify authentication by retrieving existing tokens
 * and setting up the HTTPS server for OAuth callbacks.
 *
 */
export const initSpotifyAuth = () => {
  retrieveAuthorizationToken();
  serveSpotify();
};

/**
 * Sets up Spotify authentication by checking for existing tokens
 * and generating an authorization URL if none exist.
 */
const retrieveAuthorizationToken = () => {
  const existing = getToken();

  if (existing) {
    console.log("[Spotify] Token already exists. No need to reauthorize.");
    console.log("[Spotify] Delete spotify.db to reauthorize.");
    // No need to close the app, just return
    return;
  }

  // Generate authorization URL
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes, "state-spotify");
  console.log("\n Open this link to authorize Spotify:");
  console.log(authorizeURL);
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
