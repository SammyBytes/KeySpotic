/**
 * Represents the response containing retrieved tokens.
 * @property {string} accessToken - The access token.
 * @property {string} refreshToken - The refresh token.
 * @property {number} expiresIn - The expiration time in milliseconds.
 * 
 */
export type RetrieveTokensResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};
/**
 * Maps a database row to a TokensResponse object.
 * @param row - The database row containing token information.
 * @returns The mapped TokensResponse object.
 */
export const mapRowToTokensResponse = (row: any): RetrieveTokensResponse => {
  return {
    accessToken: row.access_token,
    refreshToken: row.refresh_token,
    expiresIn: row.expires_at,
  };
};
