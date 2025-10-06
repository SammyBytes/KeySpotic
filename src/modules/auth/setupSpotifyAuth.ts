import { spotifyAuthRoutes } from "../routes/main";
import { scopes, spotifyApi } from "../spotify/config/spotifyConfig";
import { getToken } from "../spotify/config/spotifyDB";
import path from "path";

const root = process.cwd();
const certPath = path.join(root, "certs/cert.pem");
const keyPath = path.join(root, "certs/key.pem");

export async function setupSpotifyAuth() {
  const existing = getToken();

  if (existing) {
    console.log("[Spotify] Token already exists. No need to reauthorize.");
    console.log("[Spotify] 👉 Delete spotify.db to reauthorize.");
    // No need to close the app, just return
    return;
  }

  // Generate authorization URL
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes, "state-spotify");
  console.log("\n🔗 Open this link to authorize Spotify:");
  console.log(authorizeURL);

  // Start Hono just to handle callback
  Bun.serve({
    port: Number(Bun.env.HONO_PORT) || 54321,
    fetch: spotifyAuthRoutes.fetch,
    tls: { certFile: certPath, keyFile: keyPath },
  });

  console.log(
    `🌐 Server HTTPS listening on https://localhost:${Bun.env.HONO_PORT}`
  );
}
