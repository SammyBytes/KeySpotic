import db from "../../config/database";
import {
  mapRowToTokensResponse,
  RetrieveTokensResponse as TokensResponse,
} from "../../models/tokens/retrieveTokensResponse";
import {
  mapToDb,
  SaveTokensRequest,
} from "../../models/tokens/saveTokensRequest";

/**
 * Retrieves the most recent token information from the database.
 * @returns The most recent TokensResponse object or null if not found.
 */
export const retrieveTokens = (): TokensResponse | null => {
  const query = "SELECT * FROM spotify_tokens ORDER BY id DESC LIMIT 1";
  const row = db.query(query).get();
  return mapRowToTokensResponse(row) || null;
};
/**
 * Checks if any token records exist in the database.
 * @returns True if token records exist, false otherwise.
 */
export const tokenExists = (): boolean => {
  const query = "SELECT COUNT(*) as count FROM spotify_tokens";
  const row = db.query(query).get() as { count: number };
  return row.count > 0;
};

/**
 * Saves new token information to the database.
 * @param tokens - The token information to save.
 */
export const saveTokens = (tokens: SaveTokensRequest): void => {
  const insertQuery = `INSERT INTO spotify_tokens 
    (
    access_token, 
    refresh_token, 
    expires_at
    ) 
    VALUES (?, ?, ?)`;

  const params = Object.values(mapToDb(tokens));
  db.run(insertQuery, params);
};
/**
 * Updates the access token and its expiration time in the database.
 * @param newAccessToken - The new access token.
 * @param expiresIn - The expiration time in seconds.
 */
export const updateAccessToken = (
  newAccessToken: string,
  expiresIn: number
): void => {
  const expiresAtMs = Date.now() + convertToMilliseconds(expiresIn);
  const updateQuery = `UPDATE spotify_tokens 
    SET access_token = ?, expires_at = ? 
    WHERE id = (SELECT id FROM spotify_tokens ORDER BY id DESC LIMIT 1)`;

  db.run(updateQuery, [newAccessToken, expiresAtMs]);
};

const convertToMilliseconds = (seconds: number): number => {
  return seconds * 1000;
};
