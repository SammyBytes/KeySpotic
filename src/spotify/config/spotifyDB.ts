import fs from "fs";
import { join } from "path";
import { Database } from "bun:sqlite";
import { fileURLToPath } from "url";
import { binDir } from "../../shared/shared";

const dbPath = join(binDir, "keyspotic.db");
const db = new Database(dbPath);

const queries = {
  createTokensTable: fs.readFileSync(
    fileURLToPath(
      new URL(
        "./migrations/001_create_spotify_tokens_table.sql",
        import.meta.url
      )
    ),
    "utf-8"
  ),
};

db.run(queries.createTokensTable);

export default db;
