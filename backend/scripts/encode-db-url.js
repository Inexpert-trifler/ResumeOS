#!/usr/bin/env node
'use strict';
/**
 * Reads DATABASE_URL from backend/.env.local, percent-encodes the password
 * portion if it contains URL-unsafe characters, and writes the fixed URL
 * back to backend/.env.local in place.
 *
 * Safe: never prints the password or full URL.
 */

const { config } = require('dotenv');
const { resolve }  = require('path');
const { readFileSync, writeFileSync } = require('fs');

const envPath = resolve(__dirname, '../.env.local');
config({ path: resolve(__dirname, '../.env') });
config({ path: envPath, override: true });

const url = process.env.DATABASE_URL || '';
if (!url) {
  console.error('DATABASE_URL is empty. Nothing to fix.');
  process.exit(1);
}

// Check if already valid
try {
  new URL(url);
  console.log('✅ DATABASE_URL is already a valid URL — no encoding needed.');
  process.exit(0);
} catch (_) { /* needs fixing */ }

// Manual parse: scheme://user:PASS@host:port/db?params
const schemeEnd   = url.indexOf('://');
const scheme      = url.slice(0, schemeEnd);
const rest        = url.slice(schemeEnd + 3);
const lastAt      = rest.lastIndexOf('@');
const credBlock   = rest.slice(0, lastAt);
const hostBlock   = rest.slice(lastAt + 1);
const colonIdx    = credBlock.indexOf(':');
const username    = credBlock.slice(0, colonIdx);
const password    = credBlock.slice(colonIdx + 1);

const encodedPw   = encodeURIComponent(password);
const fixedUrl    = `${scheme}://${username}:${encodedPw}@${hostBlock}`;

// Validate
try {
  const p = new URL(fixedUrl);
  console.log('✅ Fixed URL is valid.');
  console.log('   hostname :', p.hostname);
  console.log('   port     :', p.port || '5432');
  console.log('   database :', p.pathname.replace('/', ''));
  console.log('   sslmode  :', p.searchParams.get('sslmode') || 'not set');
} catch (e) {
  console.error('❌ URL still invalid after encoding:', e.message);
  process.exit(1);
}

// Write back — replace only the DATABASE_URL line, leave everything else intact
const original = readFileSync(envPath, 'utf8');
const updated  = original.replace(/^DATABASE_URL=.*$/m, `DATABASE_URL=${fixedUrl}`);
writeFileSync(envPath, updated, 'utf8');

console.log('✅ backend/.env.local updated with percent-encoded DATABASE_URL.');
console.log('   Restart the backend server for the change to take effect.');
