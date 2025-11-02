import { join } from "path";
import { Database } from "bun:sqlite";
import { binDir, isProduction } from "../../shared/shared";

const dbPath = join(binDir, "keyspotic.db");
const db = new Database(dbPath);
const migrationPath = isProduction
  ? join(binDir, "migrations", "001_create_spotify_tokens_table.sql")
  : join(
      process.cwd(),
      "src",
      "migrations",
      "001_create_spotify_tokens_table.sql"
    );
const queries = {
  createTokensTable: await Bun.file(migrationPath).text(),
};

db.run(queries.createTokensTable);

export default db;
