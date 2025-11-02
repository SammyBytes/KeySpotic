import { spotifyAuthRoutes } from "./routes/main";
import { retrieveCertPaths } from "../auth/certHelper";
import { existsSync } from "fs";

import {
  retrieveTokens,
  tokenExists,
} from "./services/database/tokensServices";
import { scopes, spotifyApi } from "./config/spotify";
/**
 * Initializes Spotify authentication by retrieving existing tokens
 * and setting up the HTTPS server for OAuth callbacks.
 *
 */
export const initSpotifyAuth = () => {
  const result = retrieveAuthorizationToken();
  if (result) return;
  serveSpotify();
};

/**
 * Sets up Spotify authentication by checking for existing tokens
 * and generating an authorization URL if none exist.
 */
const retrieveAuthorizationToken = (): boolean => {
  const isTokenExists = tokenExists();

  if (isTokenExists) {
    console.log("[Spotify] Token already exists. No need to reauthorize.");
    console.log("[Spotify] Delete spotify.db to reauthorize.");
    const { accessToken } = retrieveTokens()!;
    spotifyApi.setAccessToken(accessToken);
    return true;
  }

  // Generate authorization URL
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes, "state-spotify");
  console.log("\n Open this link to authorize Spotify:");
  console.log(authorizeURL);
  return false;
};

/**
 * Sets up and starts the HTTPS server to handle Spotify OAuth callbacks.
 */
const serveSpotify = () => {
  const { certFile, keyFile } = retrieveCertPaths;
  if (!existsSync(certFile) || !existsSync(keyFile)) {
    throw new Error(
      `[Spotify] Neither certificate file nor key file found. Please ensure that both files exist at the specified paths: certFile=${certFile}, keyFile=${keyFile}`
    );
  }
  Bun.serve({
    port: Number(Bun.env.HONO_PORT) || 54321,
    fetch: spotifyAuthRoutes.fetch,
    tls: {
      certFile: certFile,
      keyFile: keyFile,
    },
  });

  console.log(
    `Server HTTPS listening on https://localhost:${Bun.env.HONO_PORT}`
  );
};
