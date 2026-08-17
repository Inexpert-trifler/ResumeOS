/**
 * check-migrations.ts
 * Checks current migration status and table existence in the database.
 */

import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(__dirname, "../../.env.local") });

import { Pool } from "pg";

async function checkMigrations(): Promise<void> {
  const url = process.env.DATABASE_URL;
  if (!url) { console.error("❌  DATABASE_URL not set"); process.exit(1); }

  const pool = new Pool({
    connectionString: url,
    max: 1,
    connectionTimeoutMillis: 10_000,
    ssl: { rejectUnauthorized: false },
  });

  try {
    // Check if drizzle migrations table exists
    const tableCheck = await pool.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    console.log("\n📋  Tables in public schema:");
    if (tableCheck.rows.length === 0) {
      console.log("   (none)");
    } else {
      tableCheck.rows.forEach((r: { table_name: string }) => console.log(`   • ${r.table_name}`));
    }

    // Check drizzle migrations journal table
    const journalCheck = await pool.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'drizzle' AND table_name = '__drizzle_migrations'
    `);
    console.log(`\n📋  Drizzle migrations table exists: ${journalCheck.rows.length > 0}`);

    if (journalCheck.rows.length > 0) {
      const migrations = await pool.query(`SELECT * FROM drizzle.__drizzle_migrations ORDER BY created_at`);
      console.log("   Applied migrations:");
      migrations.rows.forEach((r: Record<string, unknown>) => console.log(`   • ${JSON.stringify(r)}`));
    }

    // Also check if drizzle schema exists
    const schemaCheck = await pool.query(`
      SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'drizzle'
    `);
    console.log(`\n📋  Drizzle schema exists: ${schemaCheck.rows.length > 0}`);

  } finally {
    await pool.end();
  }
}

checkMigrations().catch(console.error);
