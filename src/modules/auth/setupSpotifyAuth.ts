import { spotifyAuthRoutes } from "../spotify/routes/main";
import { scopes, spotifyApi } from "../spotify/config/spotifyConfig";
import { getToken } from "../spotify/config/spotifyDB";
import { retrieveCertPaths } from "./helpers/CertHelper";

export async function setupSpotifyAuth() {
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

  // Start Hono just to handle callback
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
}
