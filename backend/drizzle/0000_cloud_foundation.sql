CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Run in the Supabase SQL editor when Storage is enabled for the project.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('resumeos-private', 'resumeos-private', false, 10485760, ARRAY['application/pdf', 'image/jpeg', 'image/png'])
ON CONFLICT (id) DO NOTHING;
