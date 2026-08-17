import { config } from "dotenv";
import { resolve } from "path";

// Load the single root .env.local — the project's only environment file.
// __dirname is backend/src/db/, so ../../.. resolves to the project root.
config({ path: resolve(__dirname, "../../../.env.local") });

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

// Safe diagnostic — never prints the actual URL value
const configured = Boolean(connectionString && connectionString.trim().length > 0);
const validFormat = configured && (
  connectionString!.startsWith("postgresql://") ||
  connectionString!.startsWith("postgres://")
);
console.log("[database] DATABASE_URL configured:", configured);
console.log("[database] DATABASE_URL valid format:", validFormat);

if (!configured) {
  console.warn(
    "[database] ⚠️  DATABASE_URL is not set. " +
    "Add it to .env.local at the project root — " +
    "protected persistence endpoints will return 503 until then."
  );
}

// Supabase requires SSL in all environments.
// rejectUnauthorized:false avoids self-signed cert issues on local dev tunnels.
const sslConfig = configured
  ? { rejectUnauthorized: process.env.NODE_ENV === "production" }
  : undefined;

const pool = new Pool({
  connectionString: connectionString ?? undefined,
  max: Number(process.env.DATABASE_POOL_MAX ?? 10),
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
  ssl: sslConfig,
});

pool.on("error", (err) => {
  console.error("[database] Unexpected pool error:", err.message);
});

export const db = drizzle({ client: pool, schema });
export { pool };
