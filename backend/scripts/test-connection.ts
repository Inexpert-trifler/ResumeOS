/**
 * test-connection.ts
 * Real PostgreSQL connection test against Supabase.
 * Run from the backend directory:
 *   npx ts-node --transpile-only scripts/test-connection.ts
 */

import { config } from "dotenv";
import { resolve } from "path";

// Load root .env.local — __dirname here is backend/scripts/, so ../.. is root.
config({ path: resolve(__dirname, "../../.env.local") });

import { Pool } from "pg";

async function testConnection(): Promise<void> {
  const url = process.env.DATABASE_URL;

  if (!url) {
    console.error("❌  DATABASE_URL is not set in root .env.local");
    process.exit(1);
  }

  // Safe: only show host + port for diagnostics, never the full URL
  let host = "(unknown)";
  let dbName = "(unknown)";
  let user = "(unknown)";
  try {
    const parsed = new URL(url);
    host = `${parsed.hostname}:${parsed.port || "5432"}`;
    dbName = parsed.pathname.replace(/^\//, "") || "postgres";
    user = parsed.username || "(unknown)";
  } catch {
    console.warn("  (Could not parse DATABASE_URL for diagnostics)");
  }

  console.log("\n🔌  ResumeOS — Supabase PostgreSQL Connection Test");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`  Host:     ${host}`);
  console.log(`  Database: ${dbName}`);
  console.log(`  User:     ${user}`);
  console.log(`  SSL:      ${url.includes("sslmode=require") ? "required ✓" : "NOT set ⚠️"}`);
  console.log("");

  const pool = new Pool({
    connectionString: url,
    max: 1,
    connectionTimeoutMillis: 8_000,
    ssl: { rejectUnauthorized: false },
  });

  try {
    // Test 1: SELECT 1
    console.log("  [1/4] Running SELECT 1 ...");
    const r1 = await pool.query("SELECT 1 AS result");
    console.log(`  ✅  SELECT 1 → ${r1.rows[0].result}`);

    // Test 2: current_database()
    console.log("  [2/4] Querying current_database() ...");
    const r2 = await pool.query("SELECT current_database() AS db");
    console.log(`  ✅  current_database() → ${r2.rows[0].db}`);

    // Test 3: current_user
    console.log("  [3/4] Querying current_user ...");
    const r3 = await pool.query("SELECT current_user AS u");
    console.log(`  ✅  current_user → ${r3.rows[0].u}`);

    // Test 4: table count
    console.log("  [4/4] Counting application tables ...");
    const r4 = await pool.query(`
      SELECT COUNT(*) AS count
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
    `);
    const tableCount = parseInt(r4.rows[0].count, 10);
    console.log(`  ✅  Tables in public schema → ${tableCount}`);

    if (tableCount > 0) {
      const r5 = await pool.query(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_type = 'BASE TABLE'
        ORDER BY table_name
      `);
      console.log("\n  Tables found:");
      r5.rows.forEach((row: { table_name: string }) => {
        console.log(`    • ${row.table_name}`);
      });
    }

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅  ALL TESTS PASSED — Supabase PostgreSQL is connected\n");
  } catch (err) {
    const error = err as NodeJS.ErrnoException & { code?: string };
    console.error("\n❌  CONNECTION FAILED");
    console.error(`  Error:    ${error.message}`);
    if (error.code) console.error(`  PG Code:  ${error.code}`);
    console.error("\n  Debugging checklist:");
    console.error("  1. Is DATABASE_URL in root .env.local correct?");
    console.error("  2. Does the URL include ?sslmode=require ?");
    console.error("  3. Is the password correct?");
    console.error("  4. Is Supabase Session Pooler at port 5432 reachable?");
    console.error("  5. Is the project paused in Supabase Dashboard?\n");
    process.exit(1);
  } finally {
    await pool.end();
  }
}

testConnection();
