/**
 * migrate.ts
 * Custom migration runner that uses our pg Pool with rejectUnauthorized:false
 * to work around Drizzle Kit's inability to pass SSL options directly.
 *
 * Run from the backend directory:
 *   npx ts-node --transpile-only scripts/migrate.ts
 */

import { config } from "dotenv";
import { resolve } from "path";

// Load root .env.local — __dirname is backend/scripts/, so ../.. is root.
config({ path: resolve(__dirname, "../../.env.local") });

import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import * as schema from "../src/db/schema";

async function runMigrations(): Promise<void> {
  const url = process.env.DATABASE_URL;

  if (!url) {
    console.error("❌  DATABASE_URL is not set in root .env.local");
    process.exit(1);
  }

  console.log("\n🔄  ResumeOS — Running Drizzle Migrations");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  const pool = new Pool({
    connectionString: url,
    max: 1,
    connectionTimeoutMillis: 15_000,
    ssl: { rejectUnauthorized: false },
  });

  const db = drizzle({ client: pool, schema });

  try {
    console.log("  Applying migrations from ./drizzle ...\n");
    await migrate(db, { migrationsFolder: resolve(__dirname, "../drizzle") });
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅  Migrations complete!\n");
  } catch (err) {
    const error = err as Error & { code?: string; detail?: string; hint?: string; where?: string };
    console.error("\n❌  Migration failed:", error.message);
    if (error.code) console.error("    PG Code:", error.code);
    if (error.detail) console.error("    Detail:", error.detail);
    if (error.hint) console.error("    Hint:", error.hint);
    if (error.where) console.error("    Where:", error.where);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrations();
