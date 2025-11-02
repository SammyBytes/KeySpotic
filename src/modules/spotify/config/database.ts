import { join } from "path";
import { Database } from "bun:sqlite";
import { mkdirSync } from "fs";

const homeDir = process.env.HOME || process.env.USERPROFILE || ".";
const configDatabase = join(homeDir, ".config", "keyspotic");
mkdirSync(configDatabase, { recursive: true });

const dbPath = join(configDatabase, "keyspotic.db");
const db = new Database(dbPath);

const queries = {
  createTokensTable: ` CREATE TABLE IF NOT EXISTS spotify_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    access_token TEXT,
    refresh_token TEXT,
    expires_at INTEGER
  );`,
};

db.run(queries.createTokensTable);

export default db;
