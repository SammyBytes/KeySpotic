import { err, ok, Result } from "../../../shared/result";
import { spotifyApi } from "../config/spotify";
import { SaveTokensRequest } from "../models/tokens/saveTokensRequest";
import { saveTokens } from "../services/database/tokensServices";

/**
 * Executes the process of saving Spotify tokens using the provided authorization code.
 */
type SaveError = "CodeMissing" | "SaveFailed";

export const executeAsync = async (
  code: string | undefined
): Promise<Result<boolean, SaveError>> => {
  try {
    if (!code) return err("CodeMissing");

    const data = await spotifyApi.authorizationCodeGrant(code);

    const saveData: SaveTokensRequest = {
      accessToken: data.body.access_token,
      refreshToken: data.body.refresh_token,
      expiresIn: data.body.expires_in,
    };

    saveTokens(saveData);
    spotifyApi.setAccessToken(saveData.accessToken);
    console.log("[Spotify] Tokens saved successfully.");
    return ok(true);
  } catch (error) {
    console.error("Error saving tokens:", error);
    return err("SaveFailed");
  }
};
