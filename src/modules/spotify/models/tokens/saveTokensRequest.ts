/**
 * Represents the request to save tokens.
 * @property {string} accessToken - The access token.
 * @property {string} refreshToken - The refresh token.
 * @property {number} expiresIn - The expiration time in milliseconds.
 *
 */
export type SaveTokensRequest = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};
/**
 * Maps data to a SaveTokensRequest object.
 * @param data  - The data containing token information.
 * @returns The mapped SaveTokensRequest object.
 */
export const mapToSaveTokensRequest = (data: any): SaveTokensRequest => {
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
  };
};
/**
 * Maps a SaveTokensRequest object to a database row format.
 * @param data - The SaveTokensRequest object.
 * @returns The mapped database row format.
 */
export const mapToDb = (data: SaveTokensRequest) => {
  return {
    access_token: data.accessToken,
    refresh_token: data.refreshToken,
    expires_at: data.expiresIn,
  };
};
