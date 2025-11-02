import fs from "fs";
import { join } from "path";
import { Database } from "bun:sqlite";
import { fileURLToPath } from "url";
import { binDir } from "../../shared";

const dbPath = join(binDir, "keyspotic.db");
export const db = new Database(dbPath);

db.run(`
  CREATE TABLE IF NOT EXISTS spotify_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    access_token TEXT,
    refresh_token TEXT,
    expires_at INTEGER
  )
`);

export function getToken(): {
  access_token: string;
  refresh_token: string;
  expires_at: number;
} {
  const row = db
    .query("SELECT * FROM spotify_tokens ORDER BY id DESC LIMIT 1")
    .get();
  return (
    (row as {
      access_token: string;
      refresh_token: string;
      expires_at: number;
    }) || null
  );
}

export function saveToken({
  access_token,
  refresh_token,
  expires_in,
}: {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}) {
  const expires_at = Date.now() + expires_in * 1000; // Convert to milliseconds
  db.run(
    "INSERT INTO spotify_tokens (access_token, refresh_token, expires_at) VALUES (?, ?, ?)",
    [access_token, refresh_token, expires_at]
  );
}

export function updateAccessToken(newAccessToken: string, expiresIn: number) {
  const expires_at = Date.now() + expiresIn * 1000;
  db.run(
    "UPDATE spotify_tokens SET access_token = ?, expires_at = ? WHERE id = (SELECT id FROM spotify_tokens ORDER BY id DESC LIMIT 1)",
    [newAccessToken, expires_at]
  );
}
export default db;
