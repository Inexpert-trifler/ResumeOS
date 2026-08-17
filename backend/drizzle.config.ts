import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";
import { resolve } from "path";

// Load the single root .env.local — the project's only environment file.
// __dirname here is backend/, so .. resolves to the project root.
config({ path: resolve(__dirname, "../.env.local") });

const url = process.env.DATABASE_URL;

// Safe diagnostic — never prints the actual URL value
const configured = Boolean(url && url.trim().length > 0);
const validFormat = configured && (
  (url as string).startsWith("postgresql://") ||
  (url as string).startsWith("postgres://")
);
console.log("[drizzle] DATABASE_URL configured:", configured);
console.log("[drizzle] DATABASE_URL valid format:", validFormat);

if (!configured) {
  console.error(
    "\n[drizzle] ❌  DATABASE_URL is not set.\n" +
    "   Add your Supabase connection string to the root .env.local:\n" +
    "   DATABASE_URL=postgresql://postgres.<ref>:<password>@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=require\n"
  );
  process.exit(1);
}

if (!validFormat) {
  console.error(
    "\n[drizzle] ❌  DATABASE_URL does not start with postgresql:// or postgres://\n" +
    "   Check the root .env.local for formatting issues.\n"
  );
  process.exit(1);
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: url as string,
    // Supabase uses an intermediate CA that pg v8 now rejects with sslmode=require
    // (treated as verify-full). Setting rejectUnauthorized:false keeps the
    // connection encrypted while accepting Supabase's certificate chain.
    ssl: { rejectUnauthorized: false },
  },
  strict: true,
  verbose: true,
});
