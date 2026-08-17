'use strict';
const { config } = require('dotenv');
const { resolve } = require('path');
const { readFileSync } = require('fs');

config({ path: resolve(__dirname, '../.env') });
config({ path: resolve(__dirname, '../.env.local'), override: true });

const raw = readFileSync(resolve(__dirname, '../.env.local'), 'utf8');
const lines = raw.split(/\r?\n/);
const dbLine = lines.find(l => l.startsWith('DATABASE_URL='));

if (!dbLine) { console.log('DATABASE_URL line NOT FOUND'); process.exit(1); }

const val = dbLine.slice('DATABASE_URL='.length);

console.log('--- URL DIAGNOSTICS (no secrets) ---');
console.log('value length          :', val.length);
console.log('has [PROJECT_REF]     :', val.includes('[PROJECT_REF]'));
console.log('has [YOUR_            :', val.includes('[YOUR_'));
console.log('starts postgresql://  :', val.startsWith('postgresql://'));
console.log('starts postgres://    :', val.startsWith('postgres://'));

// non-printable chars
const bad = [];
for (let i = 0; i < val.length; i++) {
  const c = val.charCodeAt(i);
  if (c < 33 || c > 126) bad.push({ pos: i, code: c, hex: '0x' + c.toString(16) });
}
console.log('non-printable chars   :', bad.length > 0 ? JSON.stringify(bad) : 'none');

// @ positions
const atPos = [];
for (let i = 0; i < val.length; i++) { if (val[i] === '@') atPos.push(i); }
console.log('@ positions           :', JSON.stringify(atPos));

// [ ] positions
const brackets = [];
for (let i = 0; i < val.length; i++) {
  if (val[i] === '[' || val[i] === ']') {
    brackets.push({ pos: i, char: val[i], code: val.charCodeAt(i) });
  }
}
console.log('bracket [ ] positions :', JSON.stringify(brackets));

// Try URL parse
try {
  const p = new URL(val);
  console.log('URL.parse             : VALID');
  console.log('  hostname            :', p.hostname);
  console.log('  port                :', p.port || '5432');
  console.log('  database            :', p.pathname.replace('/', ''));
  console.log('  username            :', p.username);
  console.log('  sslmode             :', p.searchParams.get('sslmode') || 'not-set');
  const isPooler = p.hostname.includes('pooler') || p.port === '6543';
  console.log('  pooler connection   :', isPooler);
} catch (e) {
  console.log('URL.parse             : INVALID —', e.code);

  // Attempt auto-fix: encode password
  const schemeEnd = val.indexOf('://');
  const scheme    = val.slice(0, schemeEnd);
  const rest      = val.slice(schemeEnd + 3);
  const lastAt    = rest.lastIndexOf('@');
  const credBlock = rest.slice(0, lastAt);
  const hostBlock = rest.slice(lastAt + 1);
  const colonIdx  = credBlock.indexOf(':');
  const username  = credBlock.slice(0, colonIdx);
  const password  = credBlock.slice(colonIdx + 1);
  const encoded   = encodeURIComponent(password);
  const fixed     = `${scheme}://${username}:${encoded}@${hostBlock}`;
  console.log('  auto-fix attempt    :');
  try {
    const fp = new URL(fixed);
    console.log('    FIXED URL is valid');
    console.log('    hostname          :', fp.hostname);
    console.log('    port              :', fp.port || '5432');
    console.log('    database          :', fp.pathname.replace('/', ''));
    console.log('    username          :', fp.username);
    console.log('    sslmode           :', fp.searchParams.get('sslmode') || 'not-set');
    console.log('');
    console.log('ACTION REQUIRED: Replace DATABASE_URL in backend/.env.local with:');
    console.log('  postgresql://<user>:<encoded-password>@<host>/<db>?sslmode=require');
    console.log('  (password must be percent-encoded — use %5B for [ and %5D for ])');
  } catch (e2) {
    console.log('    STILL INVALID:', e2.message);
    console.log('  hostBlock chars:');
    for (let i = 0; i < hostBlock.length; i++) {
      const c = hostBlock.charCodeAt(i);
      if (c < 33 || c > 126) {
        console.log(`    pos ${i}: UNUSUAL char code ${c} (0x${c.toString(16)})`);
      }
    }
  }
}
