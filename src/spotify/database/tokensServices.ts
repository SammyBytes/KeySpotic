import db from "../config/spotifyDB";
import {
  mapRowToTokensResponse,
  RetrieveTokensResponse as TokensResponse,
} from "../models/tokens/retrieveTokensResponse";
import { mapToDb, SaveTokensRequest } from "../models/tokens/saveTokensRequest";

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
