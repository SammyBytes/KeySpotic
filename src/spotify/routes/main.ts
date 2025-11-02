import { Hono } from "hono";
import { spotifyApi } from "../config/spotifyConfig";
import { saveTokens } from "../database/tokensServices";

export const spotifyAuthRoutes = new Hono();

spotifyAuthRoutes.get("/api/v1/spotify/callback", async (c) => {
  const code = c.req.query("code");
  const error = c.req.query("error");

  if (error) return c.text(`Error: ${error}`, 400);
  if (!code) return c.text("No se recibió código de Spotify.", 400);

  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const { access_token, refresh_token, expires_in } = data.body;
    saveTokens({ access_token, refresh_token, expires_in });
    console.log("Token saved successfully.");
    return c.text("Spotify authorized successfully. You can close this tab.");
  } catch (err) {
    console.error("Error saving token:", err);
    return c.text("Error saving token.", 500);
  }
});
