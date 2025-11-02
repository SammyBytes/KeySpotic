import { Hono } from "hono";

import { executeAsync } from "../useCases/saveTokensUseCases";

export const spotifyAuthRoutes = new Hono();

spotifyAuthRoutes.get("/api/v1/spotify/callback", async (c) => {
  const code = c.req.query("code");
  const error = c.req.query("error");

  if (error) return c.text(`Error: ${error}`, 400);

  const result = await executeAsync(code);
  if (result.isErr) {
    return c.text(`Error: ${result.error}`, 400);
  }

  return c.text("Spotify authorized successfully. You can close this tab.");
});
