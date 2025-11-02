import fs from "fs";
import { join } from "path";
import { Database } from "bun:sqlite";
import { binDir } from "../../shared/shared";

const dbPath = join(binDir, "keyspotic.db");
const db = new Database(dbPath);
const migrationPath = join(
  binDir,
  "migrations",
  "001_create_spotify_tokens_table.sql"
);
const queries = {
  createTokensTable: fs.readFileSync(migrationPath, "utf-8"),
};

db.run(queries.createTokensTable);

export default db;
